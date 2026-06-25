# Business Plan In A Day — DisenyoDigitals

A secure, full-stack web app that generates 7-section Filipino business plans using Claude (Anthropic). Built for Pinoy entrepreneurs. 🇵🇭

---

## Project Structure

```
/
├── frontend/        Vite + React + TypeScript (deploy to Vercel)
├── server/          Express + TypeScript + Prisma (deploy to Railway)
├── .gitignore
└── README.md
```

---

## Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) account (free PostgreSQL)
- An [Anthropic](https://console.anthropic.com) API key (**new key only — never reuse a leaked key**)
- A [Railway](https://railway.app) account (backend hosting)
- A [Vercel](https://vercel.com) account (frontend hosting)

---

## 1 — Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech) → **New Project**
2. Copy the **Connection String** (looks like `postgresql://user:pass@host/dbname?sslmode=require`)
3. Save it as `DATABASE_URL` — you'll need it in step 2

---

## 2 — Server Setup

```bash
cd server
cp .env.example .env
# Edit .env — fill in all values (see section below)
npm install
npm run db:migrate      # run Prisma migrations against Neon
npm run dev             # starts on http://localhost:3001
```

### Server environment variables (`server/.env`)

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Key from console.anthropic.com |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Random 64-char hex string (see tip below) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `ADMIN_SECRET` | Arbitrary secret for admin operations |
| `FRONTEND_ORIGIN` | Exact deployed frontend URL, e.g. `https://yourapp.vercel.app` |
| `STARTING_CREDITS` | Credits given to new accounts (default `3`) |
| `PLAN_CREDIT_COST` | Credits per plan generation (default `1`) |
| `PORT` | Server port (default `3001`) |
| `NODE_ENV` | `development` or `production` |

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3 — Frontend Setup

```bash
cd frontend
cp .env.example .env
# For local dev, leave VITE_API_BASE_URL empty (Vite proxies /api → localhost:3001)
npm install
npm run dev             # starts on http://localhost:5173
```

### Frontend environment variables (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL. Empty = use Vite proxy (local dev). Set to Railway URL in production. |

---

## 4 — Running Locally (both together)

Open two terminals:

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173`. Create an account — you get 3 free credits.

---

## 5 — Deploy: Backend → Railway

1. Push your code to a GitHub repo (make sure `.env` is gitignored ✅)
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
3. Select your repo → set **Root Directory** to `server`
4. Railway auto-detects Node.js and runs `npm run build && npm start`
5. Go to **Variables** and add all values from `server/.env.example`
6. Copy the Railway public URL (e.g. `https://yourapp.up.railway.app`)

> **Run migrations on Railway:** In the Railway shell or via a one-off command, run:
> ```bash
> npx prisma migrate deploy
> ```

---

## 6 — Deploy: Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project → Import from GitHub**
2. Set **Root Directory** to `frontend`
3. Framework preset: **Vite** (auto-detected)
4. Add environment variable:
   - `VITE_API_BASE_URL` = your Railway backend URL (no trailing slash)
5. Also update `FRONTEND_ORIGIN` in Railway's env vars to your Vercel URL
6. Deploy — Vercel gives you a live URL

---

## 7 — First Admin Setup

To make yourself an admin (so you can grant credits to users):

```bash
# In the Neon SQL editor or any Postgres client:
UPDATE "User" SET "isAdmin" = true WHERE email = 'your@email.com';
```

Then grant credits to a user via the API:

```bash
curl -X POST https://yourapp.up.railway.app/api/admin/grant-credits \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@email.com", "amount": 5, "reason": "Manual top-up"}'
```

---

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Health check |
| `POST` | `/api/auth/register` | None | Create account, returns JWT |
| `POST` | `/api/auth/login` | None | Login, returns JWT |
| `GET` | `/api/me` | JWT | Current user + credit balance |
| `POST` | `/api/plans` | JWT | Start plan (deducts 1 credit), returns planId |
| `POST` | `/api/plans/:planId/sections` | JWT | Generate one section (free retries) |
| `GET` | `/api/credits/history` | JWT | Last 50 credit transactions |
| `POST` | `/api/credits/purchase` | JWT | **Stub** — returns 501 (PayMongo TODO) |
| `POST` | `/api/admin/grant-credits` | JWT + isAdmin | Add credits to a user |
| `POST` | `/api/admin/refund` | JWT + isAdmin | Refund 1 credit to a user |

---

## Security Checklist ✅

- [x] **Claude key is server-only** — lives in `server/.env`, never sent to or seen by the browser
- [x] **Auth enforced on all routes** — `requireAuth` middleware rejects any request without a valid JWT; `requireAdmin` gates admin endpoints
- [x] **Credits enforced atomically server-side** — `prisma.$transaction` ensures balance check + deduction happen in one DB transaction; concurrent requests can't double-spend
- [x] **Secrets gitignored** — `.env` and `server/.env` are in `.gitignore`; only `.env.example` files with placeholders are committed
- [x] **Rate limiting** — 30 requests/15 min on `/api/plans`, 120 req/min global
- [x] **Input validation** — all endpoints validated with Zod; lengths capped
- [x] **CORS** — locked to `FRONTEND_ORIGIN` only
- [x] **Security headers** — Helmet applied to all responses
- [x] **Passwords** — bcrypt with cost factor 12

---

## Payments (TODO)

`POST /api/credits/purchase` currently returns `501 Not Implemented`.

To add payments, wire [PayMongo](https://developers.paymongo.com) (Philippine gateway):
1. Create a PayMongo account → get API keys
2. Add `PAYMONGO_SECRET_KEY` to server env
3. Implement checkout session creation in `server/src/routes/credits.ts`
4. Handle the webhook to credit the user's balance on successful payment

Stripe is the alternative for international cards.

---

## Local DB (alternative to Neon)

If you want a local Postgres for development:

```bash
# With Docker:
docker run --name bplan-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
# DATABASE_URL=postgresql://postgres:secret@localhost:5432/bplan
```
