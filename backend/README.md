# AssetFlow — Backend

Backend for **AssetFlow**, an Enterprise Asset & Resource Management System
(Odoo Hackathon). This folder is self-contained; the React frontend lives in
`../src`.

> **Team note:** This README + [`API.md`](./API.md) are the shared contract.
> If you're building the frontend (or driving an agent to), code against the
> endpoints and types documented here so front and back stay in sync.

---

## Tech stack & why

| Layer | Choice | Why (short version) |
|-------|--------|---------------------|
| Language | **TypeScript** | Same language as the React frontend → shared types, one mental model |
| Framework | **NestJS** | Modular structure maps to the spec's "reusable modules"; guards give clean, demonstrable RBAC |
| Database | **PostgreSQL (local Docker)** | Highly relational domain + transactions + booking-overlap checks; runs locally so it's 100% free with no cloud account |
| ORM | **Prisma** (pinned v6) | One readable schema file, type-safe queries, migrations. v6 (not v7) for stable NestJS integration |
| Auth | **JWT** (bcrypt hashes) | Matches the frontend's existing localStorage-token flow |

---

## Getting started

The database runs **locally in Docker** — free, no cloud account, no card.

```bash
cd backend
npm install

# 1. Start a local Postgres (one-time; keeps data in a Docker volume)
docker run -d --name assetflow-db \
  -e POSTGRES_USER=assetflow -e POSTGRES_PASSWORD=assetflow -e POSTGRES_DB=assetflow \
  -p 5433:5432 postgres:16-alpine
#   (already created? just: docker start assetflow-db)

# 2. Configure env
cp .env.example .env      # the default DATABASE_URL already points at the container above

# 3. Apply the schema to the database
npx prisma migrate dev

# 4. (optional) load demo data
npm run seed

# 5. Run the API
npm run start:dev         # http://localhost:4000/api
```

> **Ports:** API = **4000**, local DB = **5433** (both chosen to avoid clashing
> with another project already using 3000 / 5432 on this machine).

Handy commands:

```bash
npm run build          # type-check + compile
npx prisma studio      # visual DB browser
npx prisma generate    # regenerate the typed client after schema edits
```

---

## Data model (the keystone)

Every feature reads/writes these tables. Full definitions in
[`prisma/schema.prisma`](./prisma/schema.prisma).

- **User** — *is* the employee directory. `role` (ADMIN / ASSET_MANAGER /
  DEPARTMENT_HEAD / EMPLOYEE) is set here and **only an Admin can change it** —
  signup always creates an EMPLOYEE. This enforces "no self-assigned admin roles."
- **Department** — supports hierarchy (`parentDepartment`) and a `head` (a User).
- **AssetCategory** — with optional `customFields` (e.g. warranty period).
- **Asset** — the core entity. `status` is the lifecycle state machine:
  `AVAILABLE → ALLOCATED → AVAILABLE`, `AVAILABLE ↔ UNDER_MAINTENANCE`,
  plus `RESERVED / LOST / RETIRED / DISPOSED`. Auto `assetTag` like `AF-0001`.
- **Allocation** — who holds an asset (employee or department), with expected
  return date. Rows are kept as history; overdue = ACTIVE past its return date.
- **TransferRequest** — the workflow used when an asset is already held:
  `REQUESTED → APPROVED/REJECTED → COMPLETED`.
- **Booking** — time-slot reservations of bookable assets, with overlap checks.
- **MaintenanceRequest** — approval workflow that drives the asset's status.
- **AuditCycle / AuditAssignment / AuditItem** — scheduled verification cycles.
- **Notification / ActivityLog** — user notifications + an immutable audit trail.

---

## Feature build status

| # | Feature | Status |
|---|---------|--------|
| 0 | Project scaffold, Prisma, config | ✅ done |
| 1 | Data model (schema) | ✅ done |
| 1 | Auth (signup=Employee, login, JWT) + RBAC guard | ✅ done |
| 2 | Dashboard KPIs (`/reports/dashboard`) | ✅ done |
| 3 | Org setup (departments, categories, employee directory + role promotion) | ✅ done |
| 4 | Asset registration & directory | ✅ done |
| 5 | Allocation & transfer workflow | ✅ done |
| 6 | Resource booking (overlap validation) | ✅ done |
| 7 | Maintenance workflow | ✅ done |
| 8 | Audit cycles | ✅ done |
| 9 | Reports & analytics (+ CSV export) | ✅ done |
| 10 | Notifications & activity log | ✅ done |

**All 10 features implemented and tested end-to-end (50/50 E2E checks passing, incl. a concurrency test for the allocation lock).**

### Demo accounts (after `npm run seed`) — password `password123`
| Email | Role |
|-------|------|
| admin@assetflow.com | ADMIN |
| manager@assetflow.com | ASSET_MANAGER |
| head@assetflow.com | DEPARTMENT_HEAD |
| priya@acme.com / raj@acme.com | EMPLOYEE |

---

## Roles & permissions (RBAC)

| Capability | Admin | Asset Manager | Dept Head | Employee |
|-----------|:-----:|:-------------:|:---------:|:--------:|
| Org setup (depts, categories, roles) | ✅ | | | |
| Register / edit assets | ✅ | ✅ | | |
| Allocate assets | ✅ | ✅ | | |
| Approve transfers / maintenance / returns | ✅ | ✅ | dept-scope | |
| Book resources | ✅ | ✅ | ✅ | ✅ |
| Raise maintenance / return / transfer requests | ✅ | ✅ | ✅ | ✅ |
| View org-wide analytics | ✅ | | | |

See [`API.md`](./API.md) for the endpoint-by-endpoint contract.
