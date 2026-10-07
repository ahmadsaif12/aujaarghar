import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// name, brand, category, icon, mrp, price, stock
const rows: [string, string, string, string, number, number, number][] = [
  ["Measuring Tape 5m", "Stanley", "Hand Tools", "📏", 450, 375, 40],
  ["175-piece Tool Set", "Ingco", "Hand Tools", "🧰", 9000, 7500, 10],
  ["Claw Hammer 16oz", "Taparia", "Hand Tools", "🔨", 650, 650, 30],
  ["Adjustable Spanner", "Tolsen", "Hand Tools", "🔧", 800, 690, 25],
  ["Cordless Drill 12V", "Assur", "Power Tools", "🪛", 5625, 3450, 12],
  ["Angle Grinder 850W", "Bosch", "Power Tools", "⚙️", 7800, 7800, 8],
  ["Impact Drill 600W", "Bosch", "Power Tools", "🔩", 9500, 8500, 9],
  ["Heat Gun 1600W", "Bosch", "Power Tools", "🔥", 9400, 8000, 7],
  ["Safety Helmet", "Karam", "Safety & Welding", "⛑️", 650, 520, 30],
  ["Welding Gloves", "Total", "Safety & Welding", "🧤", 550, 400, 25],
  ["Safety Goggles", "Prescott", "Safety & Welding", "🥽", 320, 320, 40],
  ["Fire Extinguisher 2kg", "ABC", "Safety & Welding", "🧯", 3200, 2800, 14],
  ["Digital Multimeter", "UNI-T", "Lights & Electrical", "📟", 3200, 2600, 15],
  ["LED Flood Light 50W", "Philips", "Lights & Electrical", "💡", 2100, 1800, 20],
  ["Wiring Cable 90m", "Rathi", "Lights & Electrical", "🔌", 6500, 5900, 18],
  ["Multi-plug Board", "Baltra", "Lights & Electrical", "🔋", 900, 780, 35],
  ["Lawn Mower 1300W", "Garden Art", "Gardening", "🌱", 12500, 11500, 5],
  ["Garden Hose 20m", "Ingco", "Gardening", "🚿", 2400, 1950, 16],
  ["Hedge Trimmer", "Dingqi", "Gardening", "✂️", 6800, 5900, 6],
  ["Pruning Shears", "Ingco", "Gardening", "🌿", 700, 590, 22],
  ["Electric Kettle 1.8L", "Baltra", "Home Appliances", "🫖", 2300, 1850, 20],
  ["Vacuum Cleaner", "Karcher", "Home Appliances", "🧹", 24000, 18900, 4],
  ["Room Heater 2000W", "Baltra", "Home Appliances", "♨️", 2800, 2375, 11],
  ["Table Fan 16in", "CG", "Home Appliances", "🌀", 3900, 3400, 13],
];

// Fills the database with sample hardware products.
async function main() {
  await db.product.deleteMany();
  await db.product.createMany({ data: rows.map(([name, brand, category, icon, mrp, price, stock]) => ({ name, brand, category, icon, mrp, price, stock })) });
}
main().finally(() => db.$disconnect());
