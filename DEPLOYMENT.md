# Deployment Guide: Backend on Render & Frontend on Vercel

This repository contains a full-stack e-commerce application:
- **Backend API**: NestJS 11 + Prisma 7 + PostgreSQL located in [`Freskinto-api/`](file:///D:/SMIT_FINAL-PROJECT/Freskinto-api/)
- **Frontend Web**: Next.js 16 (App Router + Turbopack) located in [`Freskinto-web/`](file:///D:/SMIT_FINAL-PROJECT/Freskinto-web/)

---

## Architecture Overview

```text
[ Browser / Customer / Admin ]
        │
        ├───► [ Vercel ] Next.js Frontend (Freskinto-web)
        │         │ NEXT_PUBLIC_BASE_URL = https://freskinto-api.onrender.com/v1
        │         ▼
        └───► [ Render ] NestJS Web Service (Freskinto-api)
                  │
                  ▼
              [ Render ] PostgreSQL Database
```

---

## Part 1: Deploy Backend on Render

You can deploy the backend using either **Method A (Automated Blueprint)** or **Method B (Manual Setup)**.

### Method A: Automated Deployment via Blueprint (Recommended)

1. Push your repository to GitHub or GitLab.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your repository.
5. Render detects [`render.yaml`](file:///D:/SMIT_FINAL-PROJECT/render.yaml) automatically. It will provision:
   - A managed **PostgreSQL database** (`freskinto-db`).
   - A **Node.js Web Service** (`freskinto-api`) configured with all required build and start commands.
6. When prompted for environment variables:
   - `CORS_ORIGINS`: Set to your Vercel URL (e.g. `https://freskinto-web.vercel.app,https://*.vercel.app`) or `*` temporarily.
   - `ADMIN_EMAIL`: Initial admin login email (e.g. `admin@example.com`).
   - `ADMIN_PASSWORD`: Strong password (8-72 chars).
7. Click **Apply**. Render will build and deploy both services.

---

### Method B: Manual Setup on Render Dashboard

#### Step 1: Create PostgreSQL Database on Render
1. In Render Dashboard, click **New +** > **PostgreSQL**.
2. Set Name: `freskinto-db` (or any name).
3. Database: `onlinemart`.
4. User: `onlinemart`.
5. Region: Choose the region closest to your users (e.g. `Frankfurt` or `Oregon`).
6. Plan: **Free** (or Starter).
7. Click **Create Database**.
8. Once provisioned, copy the **Internal Database URL** (if deploying the web service in the same Render region) or **External Database URL**.

#### Step 2: Create Web Service for NestJS API
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure the following fields:
   - **Name**: `freskinto-api`
   - **Region**: Same region as your database.
   - **Branch**: `main` (or your active branch).
   - **Root Directory**: `Freskinto-api` *(CRITICAL: Must point to the backend folder)*
   - **Runtime**: `Node` (or `Docker` using the provided [`Dockerfile`](file:///D:/SMIT_FINAL-PROJECT/Freskinto-api/Dockerfile))
   - **Build Command**:
     ```bash
     npm install --include=dev && npm run build
     ```
     *(CRITICAL: `--include=dev` is necessary because `NODE_ENV=production` causes npm to omit devDependencies like `@nestjs/cli` and `typescript`)*
   - **Start Command**:
     ```bash
     npm run db:deploy && npm run start:prod
     ```
     *(This automatically runs Prisma migrations on every deploy before starting the server)*
   - **Health Check Path**: `/v1/health`

#### Step 3: Add Backend Environment Variables on Render
Under the **Environment** tab of the Web Service, add:

| Variable | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations & disables public Swagger |
| `PORT` | `10000` | Render default port (our code binds to `0.0.0.0`) |
| `URL_PREFIX` | `v1` | Global API prefix for all routes |
| `DATABASE_URL` | *Internal Connection String* | From your Render PostgreSQL database |
| `JWT_SECRET` | *Random string >= 32 chars* | Generate a secure secret (e.g. `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime (e.g. `7d` or `1d`) |
| `CORS_ORIGINS` | `https://freskinto-web.vercel.app,https://*.vercel.app` | Comma-separated allowed frontend origins |
| `PAYMENT_WEBHOOK_SECRET` | *Random string >= 16 chars* | Secret for webhook HMAC verification |
| `ADMIN_EMAIL` | `admin@example.com` | Initial admin account email for seed script |
| `ADMIN_PASSWORD` | `SecureAdminPass123!` | Initial admin password (8-72 chars) |
| `ADMIN_NAME` | `Store Admin` | Admin display name |

Click **Save Changes**. Render will automatically build and deploy the web service.

---

### Step 4: Seed the Initial Admin Account

To seed the initial admin account:

**Option 1: Via Render Shell (Dashboard)**
1. In your `freskinto-api` service on Render, open the **Shell** tab.
2. Run:
   ```bash
   npm run db:seed
   ```
   Output: `Admin created: admin@example.com`.

**Option 2: From your local machine**
```bash
cd Freskinto-api
DATABASE_URL="<External Database URL from Render>" ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="SecureAdminPass123!" ADMIN_NAME="Store Admin" npm run db:seed
```

---

### Step 5: Verify Backend Health

Once deployment finishes, Render gives you a public URL (e.g., `https://freskinto-api.onrender.com`).
Visit:
```text
https://<your-render-service>.onrender.com/v1/health
```
Expected response:
```json
{
  "status": "ok",
  "database": "up"
}
```

---

## Part 2: Deploy Frontend on Vercel

### Method A: Via Vercel Web Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** > **Project**.
2. Import your Git repository.
3. In the **Configure Project** screen:
   - **Project Name**: `freskinto-web` (or any custom name).
   - **Framework Preset**: `Next.js` (detected automatically).
   - **Root Directory**: Click **Edit** and select `Freskinto-web`. *(CRITICAL: Do not leave at repo root).*
   - **Build and Output Settings**: Keep default (`next build`).
4. In **Environment Variables**, add:
   - **Key**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://<your-render-service>.onrender.com/v1`
     *(Note: The frontend automatically normalizes this URL — trailing slashes are stripped and `/v1` is automatically appended if accidentally omitted).*
5. Click **Deploy**.

---

### Method B: Via Vercel CLI

```bash
# Navigate to the frontend directory
cd Freskinto-web

# Log in to Vercel
npx vercel login

# Link and deploy
npx vercel

# When deploying to production
npx vercel --prod
```
When prompted for environment variables, add `NEXT_PUBLIC_BASE_URL=https://<your-render-service>.onrender.com/v1`.

---

## Part 3: Synchronize CORS on Render

Once your Vercel deployment completes, Vercel will assign you a domain:
- Example: `https://freskinto-web.vercel.app`

1. Go to **Render Dashboard** > `freskinto-api` > **Environment**.
2. Update `CORS_ORIGINS`:
   ```env
   CORS_ORIGINS=https://freskinto-web.vercel.app,https://*.vercel.app
   ```
   *(Including `https://*.vercel.app` allows Vercel preview branch deployments to communicate with your backend).*
3. Save changes. Render will automatically redeploy with the updated CORS policy.

---

## Part 4: Production Verification Checklist

1. [ ] **Health Check**: `https://<render-backend>/v1/health` returns `{"status":"ok","database":"up"}`.
2. [ ] **Frontend Loading**: `https://<vercel-frontend>` renders the landing page, products, and categories.
3. [ ] **Customer Authentication**:
   - Register a new customer at `/register`.
   - Verify redirect to `/shop` with session preserved.
4. [ ] **Cart & Checkout**:
   - Add items to cart.
   - Proceed to `/checkout` and initiate mock payment.
5. [ ] **Admin Authentication**:
   - Log in with the seeded admin account at `/login`.
   - Confirm automatic redirect to `/admin/dashboard` or `/admin/orders`.
   - Test category and product creation in the admin workspace.

---

## Troubleshooting & FAQ

### 1. Render Free Tier Cold Starts
- **Symptom**: The first API request after 15 minutes of inactivity takes 40-50 seconds to respond.
- **Why**: Render free web services spin down after 15 minutes without inbound HTTP requests.
- **Solution**:
  - The frontend has built-in retry and friendly network error handling.
  - To keep the service warm on the free tier, you can use a free uptime monitoring tool (like UptimeRobot or Cron-job.org) to ping `https://<your-render-backend>/v1/health` every 10 minutes.
  - Alternatively, upgrade the Web Service to Render's "Starter" tier ($7/month) for continuous zero-cold-start availability.

### 2. CORS Errors in Browser Console
- **Symptom**: `Access to fetch at ... has been blocked by CORS policy`.
- **Check**:
  - Ensure `CORS_ORIGINS` in Render environment matches your Vercel URL scheme (`https://`) and hostname.
  - Our updated CORS configuration strips trailing slashes and supports wildcard subdomains like `https://*.vercel.app`.

### 3. Database Connection Errors on Render
- **Symptom**: Server crashes on startup with `Can't reach database server`.
- **Check**:
  - If both Web Service and Database are on Render, use the **Internal Database URL** for lower latency and free internal bandwidth.
  - If using an external database (Neon, Supabase), ensure `?sslmode=require` is present in the `DATABASE_URL`.
