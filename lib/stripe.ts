import Stripe from "stripe";

// Stripe client using your secret test key from the .env file.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// Converts a price in Nepali rupees to US cents using the NPR_PER_USD rate.
export function nprToUsdCents(npr: number) {
  return Math.max(50, Math.round((npr / Number(process.env.NPR_PER_USD ?? 133)) * 100));
}
