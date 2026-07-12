# AssetFlow API Reference

> **Living contract for the whole team.** Frontend agents: build against this.
> Base URL: `http://localhost:4000/api`
> (port 4000, not 3000 — 3000 was taken by another local project.)

## Conventions

- **Auth:** send the JWT as `Authorization: Bearer <token>` on every protected
  route. Get the token from `/auth/signup` or `/auth/login`.
- **Content type:** `application/json` (except the CSV export, which returns `text/csv`).
- **Errors:** non-2xx look like `{ "statusCode": 409, "message": "...", "error": "Conflict" }`.
  The allocation-conflict 409 additionally includes `currentHolder`, `currentDepartment`, `currentAllocationId`.
- **List endpoints** return `{ items: [...], total: number }`. Common query params: `take`/`skip` (or `page`/`limit`/`pageSize`), plus per-resource filters. Page size is capped at 200.
- **IDs** are opaque strings (cuid). **Dates** are ISO 8601 strings.
- **Roles:** `ADMIN`, `ASSET_MANAGER`, `DEPARTMENT_HEAD`, `EMPLOYEE`. "any auth" = any logged-in user.
- **Enums** (from `schema.prisma`): `AssetStatus` = AVAILABLE · ALLOCATED · RESERVED · UNDER_MAINTENANCE · LOST · RETIRED · DISPOSED; `AssetCondition` = NEW · GOOD · FAIR · POOR · DAMAGED; `MaintenancePriority` = LOW · MEDIUM · HIGH · CRITICAL.

---

## Auth  ✅
| Method | Path | Roles | Body / notes |
|---|---|---|---|
| POST | `/auth/signup` | public | `{ name, email, password }` → `{ token, user }`. Always creates an **EMPLOYEE**. |
| POST | `/auth/login` | public | `{ email, password }` → `{ token, user }`. |
| GET | `/auth/me` | any auth | → current `{ id, name, email, role, departmentId }`. |

`user` shape everywhere: `{ id, name, email, role, status, departmentId }`. **passwordHash is never returned.**

## Organization Setup (#3)  ✅
| Method | Path | Roles | Notes |
|---|---|---|---|
| POST | `/org/departments` | ADMIN | `{ name, headId?, parentDepartmentId?, status? }`. Dupe name → 409; parent cycle → 400. |
| GET | `/org/departments` | any auth | filters `q`, `status`. |
| GET | `/org/departments/:id` | any auth | incl head, parent, children, member count. |
| PATCH | `/org/departments/:id` | ADMIN | edit name/head/parent/status. |
| POST | `/org/categories` | ADMIN | `{ name, customFields?, status? }`. |
| GET | `/org/categories` | any auth | filters `q`, `status`; incl asset count. |
| GET | `/org/categories/:id` | any auth | |
| PATCH | `/org/categories/:id` | ADMIN | |
| GET | `/org/employees` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | filters `q`, `departmentId`, `role`, `status`. |
| GET | `/org/employees/:id` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | |
| PATCH | `/org/employees/:id` | ADMIN | edit name, departmentId, status. Can't deactivate the last active admin (409). |
| PATCH | `/org/employees/:id/role` | ADMIN | `{ role }`. **The only place roles change.** Can't demote the last admin (409). |

## Assets (#4)  ✅
| Method | Path | Roles | Notes |
|---|---|---|---|
| POST | `/assets` | ADMIN, ASSET_MANAGER | `{ name, categoryId, serialNumber?, acquisitionDate?, acquisitionCost?, condition?, location?, photoUrl?, documents?, isBookable?, customFieldValues? }`. Auto tag `AF-0001`. |
| GET | `/assets` | any auth | filters `q` (tag/serial/name — a QR scan yields the tag), `categoryId`, `status`, `location`, `isBookable`, `take`, `skip`. |
| GET | `/assets/:id` | any auth | detail incl category + current holder. |
| GET | `/assets/:id/history` | any auth | `{ allocations: [...], maintenance: [...] }`. |
| PATCH | `/assets/:id` | ADMIN, ASSET_MANAGER | edit fields; may set RETIRED/DISPOSED/LOST. Manual ALLOCATED/UNDER_MAINTENANCE/RESERVED → 400 (owned by workflows). |

## Allocation & Transfer (#5)  ✅
| Method | Path | Roles | Notes |
|---|---|---|---|
| POST | `/allocations` | ADMIN, ASSET_MANAGER | `{ assetId, holderUserId? \| departmentId?, expectedReturnDate? }`. **Conflict:** already-held → 409 (with current holder). Row-locked against races. |
| POST | `/allocations/:id/return` | ADMIN, ASSET_MANAGER | `{ checkInNotes?, conditionOnReturn? }` → asset back to AVAILABLE. |
| GET | `/allocations` | any auth | filters `assetId`, `holderUserId`, `departmentId`, `status`, `overdue`. |
| GET | `/allocations/overdue` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | past expected return date. |
| POST | `/transfers` | any auth | `{ assetId, toUserId? \| toDepartmentId?, reason? }` (asset must be currently held). |
| POST | `/transfers/:id/approve` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | atomically re-allocates to the target. |
| POST | `/transfers/:id/reject` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | |
| GET | `/transfers` | any auth | filters `status`, `assetId`. |

## Resource Booking (#6)  ✅
| Method | Path | Roles | Notes |
|---|---|---|---|
| POST | `/bookings` | any auth | `{ assetId, startTime, endTime, purpose? }`. Asset must be `isBookable` & in service. **Overlap → 409** (touching boundaries allowed). Row-locked. |
| GET | `/bookings` | any auth | filters `assetId`, `status`, `from`, `to` (calendar), `mine`. Each item has a derived `effectiveStatus` (UPCOMING/ONGOING/COMPLETED/CANCELLED). |
| GET | `/bookings/:id` | any auth | |
| POST | `/bookings/:id/cancel` | booker or ADMIN/ASSET_MANAGER | |
| PATCH | `/bookings/:id/reschedule` | booker or ADMIN/ASSET_MANAGER | `{ startTime, endTime }` — re-validates overlap. |

## Maintenance (#7)  ✅
State machine: `PENDING → APPROVED/REJECTED → TECHNICIAN_ASSIGNED → IN_PROGRESS → RESOLVED` (invalid jumps → 409).
| Method | Path | Roles | Notes |
|---|---|---|---|
| POST | `/maintenance` | any auth | `{ assetId, description, priority?, photoUrl? }`. |
| POST | `/maintenance/:id/approve` | ADMIN, ASSET_MANAGER | asset → UNDER_MAINTENANCE. |
| POST | `/maintenance/:id/reject` | ADMIN, ASSET_MANAGER | |
| POST | `/maintenance/:id/assign` | ADMIN, ASSET_MANAGER | `{ technicianName }`. |
| POST | `/maintenance/:id/start` | ADMIN, ASSET_MANAGER | |
| POST | `/maintenance/:id/resolve` | ADMIN, ASSET_MANAGER | `{ resolutionNotes? }`. Asset → AVAILABLE (or back to ALLOCATED if still held). |
| GET | `/maintenance` | any auth | filters `assetId`, `status`, `priority`, `mine`. |
| GET | `/maintenance/:id` | any auth | |

## Audit (#8)  ✅
| Method | Path | Roles | Notes |
|---|---|---|---|
| POST | `/audits` | ADMIN | `{ name, scopeDepartmentId?, scopeLocation?, startDate, endDate }`. Auto-generates audit items for in-scope assets. |
| POST | `/audits/:id/auditors` | ADMIN | `{ auditorIds: [] }`. |
| GET | `/audits` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | with result counts. |
| GET | `/audits/:id` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | |
| GET | `/audits/:id/items` | assigned auditor or ADMIN/ASSET_MANAGER | |
| PATCH | `/audits/:id/items/:itemId` | assigned auditor or ADMIN/ASSET_MANAGER | `{ result: VERIFIED\|MISSING\|DAMAGED, notes? }`. Rejected if cycle CLOSED. |
| GET | `/audits/:id/discrepancies` | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD | MISSING + DAMAGED items. |
| POST | `/audits/:id/close` | ADMIN | locks cycle; MISSING → asset LOST, DAMAGED → condition DAMAGED. |

## Dashboard & Reports (#2, #9)  ✅
| Method | Path | Roles | Notes |
|---|---|---|---|
| GET | `/reports/dashboard` | any auth | KPI cards: assetsAvailable, assetsAllocated, assetsUnderMaintenance, maintenanceToday, activeBookings, pendingTransfers, upcomingReturns, overdueReturns (+ `overdueList`, `upcomingReturnsList`). |
| GET | `/reports/asset-utilization` | ADMIN, ASSET_MANAGER | most-used vs idle. |
| GET | `/reports/maintenance-frequency` | ADMIN, ASSET_MANAGER | by asset & category. |
| GET | `/reports/due-maintenance` | ADMIN, ASSET_MANAGER | assets due/aging. |
| GET | `/reports/department-allocation` | ADMIN, ASSET_MANAGER | per-department totals. |
| GET | `/reports/booking-heatmap` | ADMIN, ASSET_MANAGER | `{ dayOfWeek, hour, count }[]`. |
| GET | `/reports/export/assets.csv` | ADMIN, ASSET_MANAGER | returns `text/csv`. |

## Notifications & Activity Log (#10)  ✅
| Method | Path | Roles | Notes |
|---|---|---|---|
| GET | `/notifications` | any auth | `{ items, unreadCount }`. `?unread=true` for unread only. |
| PATCH | `/notifications/:id/read` | any auth (own) | |
| POST | `/notifications/read-all` | any auth | |
| GET | `/activity` | ADMIN, ASSET_MANAGER | immutable audit log. filters `entityType`, `entityId`, `actorId`, `take`, `skip`. |

---

### Known trade-offs (documented, acceptable for the hackathon scope)
- `GET /allocations` and `/reports/dashboard` are readable by any authenticated user (they include holder names). Fine for internal use; could be tightened to per-user scope later.
- Booking `effectiveStatus` is derived on read (no background job flips UPCOMING→ONGOING→COMPLETED in the DB).
- Asset-tag generation is sequential and safe up to `AF-9999`.
