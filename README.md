# Taskflow

A Linear/Trello-style project management app: accounts, teams, role-based permissions, Kanban boards, task comments and a full activity history.

**Stack:** Next.js 15 (App Router, Server Actions) · TypeScript · PostgreSQL · Prisma · Zod · Vitest · Playwright · Vercel + Neon

## Run it locally

Prerequisites: Node 20+, Docker (for local Postgres).

```bash
npm install
cp .env.example .env
npm run db:up                         # starts Postgres in Docker
npm run db:migrate -- --name init     # creates the tables
npm run dev                           # http://localhost:3000
```

Run the tests:

```bash
npm test
npm run typecheck
```

Browse the database: `npm run db:studio`.

## Roadmap

- [x] **Stage 1** — Project setup, full data model, email/password auth with DB sessions
- [ ] **Stage 2** — Teams, invites, OWNER / ADMIN / MEMBER / VIEWER roles enforced on the server
- [ ] **Stage 3** — Projects, tasks, Kanban board with drag-and-drop
- [ ] **Stage 4** — Comments and activity history
- [ ] **Stage 5** — Integration + end-to-end tests, GitHub Actions CI, deploy to Vercel + Neon

## Project structure

```
prisma/schema.prisma       Data model (all entities)
src/middleware.ts          Fast redirect for signed-out users
src/lib/db.ts              Prisma client singleton
src/lib/auth/              Password hashing and session management
src/lib/validation.ts      Zod schemas shared by actions and tests
src/app/(auth)/            Login, signup and their server actions
src/app/dashboard/         Signed-in area
tests/                     Vitest unit tests
```

## Design decisions

Notes on why things are built the way they are — useful for code reviews and interviews.

**Database sessions instead of JWTs.** The cookie holds a random 256-bit token; the database stores only its SHA-256 hash. Logging out deletes the row, so the session is revoked immediately — a JWT stays valid until it expires. A leaked DB dump can't be replayed as cookies because only hashes are stored. The trade-off is one indexed DB lookup per request.

**Cookie flags.** `httpOnly` keeps the token away from JavaScript (limits XSS damage), `sameSite=lax` stops it being sent on cross-site POSTs (CSRF), and `secure` is on in production.

**No user enumeration on login.** Unknown email and wrong password return the same message, and both run one bcrypt compare (against a dummy hash if the user doesn't exist), so response timing doesn't reveal which emails are registered.

**Unique index over "check then insert".** Sign-up inserts and catches Prisma's `P2002` unique-violation error instead of querying first. Two simultaneous sign-ups with the same email can't both succeed.

**bcrypt's 72-byte limit.** bcrypt ignores bytes past 72, so passwords longer than that are rejected rather than silently truncated.

**Middleware is optimistic; the server is authoritative.** Middleware runs on the Edge and can't use Prisma, so it only checks that a cookie exists. Every protected page calls `requireUser()`, which validates the session against the database.

**Full schema up front.** Teams, roles, tasks, comments and activity are modelled in Stage 1 so later stages add features rather than reshaping tables. Highlights:

- `Task.position` is a float, so dragging a card between positions 1.0 and 2.0 writes 1.5 — one row update instead of renumbering the column.
- `Project.taskCounter` gives human-friendly ids like `WEB-12`, backed by a `(projectId, number)` unique constraint.
- `Activity` has no foreign key to the changed entity, so history survives deletes. It will be written in the same transaction as each change.

## Known limitations (planned)

- No rate limiting on login yet (Stage 5).
- No email verification or password reset.
