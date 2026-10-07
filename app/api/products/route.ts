import { db } from "@/lib/db";

// Returns all products as JSON for the store and future mobile app.
export async function GET() {
  return Response.json(await db.product.findMany({ orderBy: { id: "asc" } }));
}
