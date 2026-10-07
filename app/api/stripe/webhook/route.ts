import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// Receives Stripe's payment confirmation and marks the order as paid after checking the signature.
export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET)
    return new Response("Stripe webhook is not configured", { status: 503 });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  let event;
  try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? ""); }
  catch { return new Response("Invalid signature", { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const id = Number((event.data.object as { metadata?: { orderId?: string } }).metadata?.orderId);
    if (id) await db.order.update({ where: { id }, data: { status: "paid" } });
  }
  return new Response("ok");
}
