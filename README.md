# AujarGhar — full-stack hardware store

A responsive Nepali hardware marketplace inspired by the reference storefront. It includes search and category browsing, a working cart, cash-on-delivery order creation, optional Stripe test checkout, seeded product data, and a PostgreSQL database.

The showroom contact shown in the footer and header is **9811763721**.

## Start with Docker (recommended)

1. Copy the provided settings if needed: `cp .env.example .env`.
2. Start PostgreSQL and the Next.js app: `docker compose up --build`.
3. Open [http://localhost:3000](http://localhost:3000).

On first startup the app applies the Prisma schema and inserts the 40-item dummy hardware catalog. Seeds are idempotent, so restarting the containers does not create duplicates.

Stop the stack with `docker compose down`. Add `-v` only when you intentionally want to remove the PostgreSQL data volume.

## Local development without Docker

Run PostgreSQL locally and set `DATABASE_URL` in `.env`, then:

```bash
npm install
npm run db:generate
npm run db:push
npm run seed
npm run dev
```

## Payments

Cash on delivery works with no extra configuration. For Stripe test checkout, add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to `.env`; leave them blank otherwise. Use `stripe listen --forward-to localhost:3000/api/stripe/webhook` while testing webhooks.

## Authentication API

`POST /api/auth/register` accepts `name`, `email`, `password` (8+ characters), and optional `phone`. `POST /api/auth/login` accepts `email` and `password`. Both create a signed, HttpOnly session cookie and return the safe user profile. `GET /api/auth/me` returns the signed-in user, while `POST /api/auth/logout` clears the session.

Set a unique 32-character-or-longer `AUTH_SECRET` before any production deployment.
