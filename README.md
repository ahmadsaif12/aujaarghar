# AujarGhar – Hardware Store

Next.js + TypeScript + Prisma (SQLite). Works on laptop and mobile browsers.

## Run it
```bash
npm install
npx prisma db push
npm run seed
npm run dev
```
Open http://localhost:3000

## Next steps
Admin panel for products and stock, Khalti and eSewa payments, installable mobile (PWA).
For Claude on GitHub: add `ANTHROPIC_API_KEY` as a repo secret, then tag `@claude` in issues.

## Stripe (test mode)
1. Copy `.env.example` to `.env` and add your `sk_test_...` key.
2. Run `npm install`, then in a second terminal: `stripe listen --forward-to localhost:3000/api/stripe/webhook` and put the `whsec_...` it prints in `.env`.
3. At checkout choose Stripe and pay with test card 4242 4242 4242 4242 (any future date, any CVC).
