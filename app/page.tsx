import { db } from "@/lib/db";
import Store from "@/components/Store";

export const dynamic = "force-dynamic";

// Loads products from the database and shows the store page.
export default async function Home() {
  return <Store products={await db.product.findMany({ orderBy: { id: "asc" } })} />;
}
