# AssetFlow — Enterprise Asset & Resource Management System

AssetFlow is a centralized ERP for tracking, allocating, and maintaining an
organization's physical assets and shared resources — assets, allocations &
transfers, resource bookings, a maintenance approval workflow, audit cycles,
reports, and role-based dashboards for Admin, Asset Manager, Department Head,
and Employee.

Built for the Odoo Hackathon with **React + TypeScript + Vite + Tailwind**
(frontend) and **NestJS + PostgreSQL + Prisma** (backend, in [`backend/`](backend)).

---

## ▶️ Run the demo (no backend or database needed)

The frontend runs **standalone on realistic demo data** — perfect for trying it
on any laptop or recording a walkthrough.

```bash
npm install
npm run dev      # open http://localhost:5173
```

### Demo accounts
Sign in with any of these emails and **any password** — each shows that role's
dashboard and screens:

| Email | Role you experience |
|-------|---------------------|
| `admin@assetflow.com` | **Admin** — org setup, all analytics |
| `manager@assetflow.com` | **Asset Manager** — register/allocate assets, approvals |
| `head@assetflow.com` | **Department Head** — department view + approvals |
| `employee@assetflow.com` | **Employee** — my assets, book resources, raise requests |

Any other email signs in as an Employee. (Sign-up also creates an Employee.)

### What you can show in the demo
Log in as each role and walk the sidebar: **Dashboard** (role-specific KPIs),
**Asset Directory**, **Allocations & Transfers**, **Resource Booking**,
**Maintenance**, **Asset Audits**, **Reports & Analytics**, **Organization
Setup** (Admin). Data shown is representative demo data.

---

## 🔌 Running against the real backend (optional)

The full REST API lives in [`backend/`](backend) (NestJS + Postgres + Prisma) and
is documented in [`backend/API.md`](backend/API.md). It implements all 10 features
with real auth (JWT), RBAC, and workflow logic, and is covered by end-to-end
tests. See [`backend/README.md`](backend/README.md) to run it (Docker Postgres +
`npm run start:dev`, serving `http://localhost:4000/api`).

> Note: the demo UI currently uses built-in demo data so it runs anywhere with
> zero setup. Wiring the live API into every screen (aligning endpoint paths and
> auth) is the remaining integration step; the backend contract is ready in
> `backend/API.md`.

---

## Tech stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts, Framer Motion
- **Backend:** NestJS, TypeScript, PostgreSQL, Prisma, JWT + bcrypt
