# AssetFlow API Reference

> **Living document** — updated as each backend module ships. Frontend agents:
> build against this. Base URL: `http://localhost:4000/api`
> (port 4000, not 3000 — 3000 was taken by another local project.)

## Conventions

- **Auth:** send the JWT as `Authorization: Bearer <token>` on every protected
  route. You get the token from `/auth/signup` or `/auth/login`.
- **Content type:** `application/json`.
- **Errors:** non-2xx responses look like
  `{ "statusCode": 400, "message": "...", "error": "Bad Request" }`.
- **IDs** are opaque strings (cuid).
- **Roles:** `ADMIN`, `ASSET_MANAGER`, `DEPARTMENT_HEAD`, `EMPLOYEE`.

---

## Auth  _(status: ✅ live)_

The shape below matches what the frontend's `src/lib/auth.ts` already expects
(`{ token, user }`), extended with `role`. Send the token as
`Authorization: Bearer <token>` on every protected route.

### `POST /auth/signup`
Creates an **Employee** account (role is never chosen at signup).

Request:
```json
{ "name": "Priya Sharma", "email": "priya@acme.com", "password": "secret123" }
```
Response `201`:
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "clx...", "name": "Priya Sharma", "email": "priya@acme.com", "role": "EMPLOYEE" }
}
```

### `POST /auth/login`
Request:
```json
{ "email": "priya@acme.com", "password": "secret123" }
```
Response `200`: same `{ token, user }` shape as signup.

### `GET /auth/me`
Returns the current user from the bearer token. Response `200`:
```json
{ "id": "clx...", "name": "Priya Sharma", "email": "priya@acme.com", "role": "EMPLOYEE", "departmentId": null }
```

---

## Organization Setup  _(status: ⬜ planned)_
Departments, asset categories, employee directory + role promotion (Admin only).

## Assets  _(status: ⬜ planned)_
Register, search/filter, per-asset history.

## Allocation & Transfer  _(status: ⬜ planned)_
Allocate, conflict rule, transfer approval, return, overdue.

## Booking  _(status: ⬜ planned)_
Create booking with overlap validation, cancel/reschedule, calendar view.

## Maintenance  _(status: ⬜ planned)_
Raise request, approval workflow, technician assignment, resolve.

## Audit  _(status: ⬜ planned)_
Create cycle, assign auditors, mark items, discrepancy report, close cycle.

## Dashboard & Reports  _(status: ⬜ planned)_
KPI cards, utilization, maintenance frequency, booking heatmap, exports.

## Notifications & Activity Log  _(status: ⬜ planned)_
List/mark-read notifications, activity feed.
