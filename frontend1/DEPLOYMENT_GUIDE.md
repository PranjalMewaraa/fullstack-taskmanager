# Track A (frontend1) Run and Deploy Guide

## 1. Local Run

### Prerequisites
- Node.js 20+
- Backend running from `/Users/pranjal/Desktop/MyProject/task-manager/backend`
- PostgreSQL configured for backend

### Backend setup (once)
```bash
cd /Users/pranjal/Desktop/MyProject/task-manager/backend
cp .env.example .env
# Fill real values in .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend should run on `http://localhost:5000` and expose API at `http://localhost:5000/api/v1`.

### Frontend1 setup
```bash
cd /Users/pranjal/Desktop/MyProject/task-manager/frontend1
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Required Frontend Env

Set in `frontend1/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

## 3. Production Deployment

### Recommended stack
- Frontend: Vercel
- Backend API: Railway or Render
- Database: Neon or Supabase Postgres

### A. Deploy backend first
1. Push backend code to GitHub.
2. Create Railway/Render service from repo.
3. Provision PostgreSQL (or connect Neon/Supabase DB).
4. Set backend env vars:
   - `NODE_ENV=production`
   - `PORT` (platform-provided or `5000`)
   - `DATABASE_URL`
   - `ACCESS_TOKEN_SECRET`
   - `REFRESH_TOKEN_SECRET`
   - `ACCESS_TOKEN_EXPIRES_IN=15m`
   - `REFRESH_TOKEN_EXPIRES_IN=7d`
   - `FRONTEND_ORIGIN=https://<your-vercel-domain>`
   - `BCRYPT_SALT_ROUNDS=12`
5. Run Prisma migrations in production:
```bash
npx prisma migrate deploy
npx prisma generate
```
6. Start command:
```bash
npm run start
```

### B. Deploy frontend on Vercel
1. Import repo/project into Vercel.
2. Set Root Directory to `frontend1`.
3. Add env var in Vercel project:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>/api/v1`
4. Deploy.

## 4. Production Security Checklist

- Backend cookie config should stay:
  - `httpOnly: true`
  - `secure: true` (when `NODE_ENV=production`)
  - `sameSite: 'strict'`
- Backend CORS must allow only the Vercel frontend origin.
- API and frontend must both use HTTPS.

## 5. Verify After Deploy

1. Register a new user.
2. Login and create tasks.
3. Refresh browser tab to confirm refresh-token session restore.
4. Test search + status filter + pagination.
5. Logout and verify protected routes redirect to login.
