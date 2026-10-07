import { db } from "@/lib/db";
import { stripe, nprToUsdCents } from "@/lib/stripe";

type Line = { id: number; qty: number };

// Creates a cash-on-delivery order, recalculating prices and stock on the server.
export async function POST(req: Request) {
  const { name, phone, address, items, payment = "cod" } = (await req.json()) as { name: string; phone: string; address: string; items: Line[]; payment?: "cod" | "stripe" };
  if (!name?.trim() || !phone?.trim() || !address?.trim() || !items?.length)
    return Response.json({ error: "Name, phone, address and items are required." }, { status: 400 });

  const products = await db.product.findMany({ where: { id: { in: items.map((i) => i.id) } } });
  let total = 0;
  for (const i of items) {
    const p = products.find((x) => x.id === i.id);
    if (!p || i.qty < 1 || p.stock < i.qty) return Response.json({ error: `Not enough stock for ${p?.name ?? "an item"}.` }, { status: 409 });
    total += p.price * i.qty;
  }

  const order = await db.$transaction(async (tx) => {
    for (const i of items) await tx.product.update({ where: { id: i.id }, data: { stock: { decrement: i.qty } } });
    return tx.order.create({
      data: { name, phone, address, total, payment, items: { create: items.map((i) => ({ productId: i.id, qty: i.qty, price: products.find((p) => p.id === i.id)!.price })) } },
    });
  });
  if (payment === "stripe") {
    if (!stripe) return Response.json({ error: "Online card payments are not configured yet. Please choose cash on delivery." }, { status: 503 });
    const base = process.env.APP_URL ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((i) => { const p = products.find((x) => x.id === i.id)!; return { quantity: i.qty, price_data: { currency: "usd", product_data: { name: p.name }, unit_amount: nprToUsdCents(p.price) } }; }),
      metadata: { orderId: String(order.id) },
      success_url: `${base}/?paid=${order.id}`,
      cancel_url: `${base}/?cancelled=${order.id}`,
    });
    return Response.json({ orderId: order.id, total, url: session.url });
  }
  return Response.json({ orderId: order.id, total });
}
