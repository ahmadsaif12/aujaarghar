import Stripe from "stripe";

// Stripe is optional: cash on delivery works with an empty local .env.
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Converts a price in Nepali rupees to US cents using the NPR_PER_USD rate.
export function nprToUsdCents(npr: number) {
  return Math.max(50, Math.round((npr / Number(process.env.NPR_PER_USD ?? 133)) * 100));
}
