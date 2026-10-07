import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const photo = {
  drill: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=85",
  tools: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=85",
  hammer: "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=900&q=85",
  electrical: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=85",
  safety: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=85",
  garden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85",
  appliance: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=85",
  auto: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=85",
  farm: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=85",
  office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
};

type ProductSeed = { slug: string; name: string; brand: string; category: string; icon: string; mrp: number; price: number; stock: number; image: string };

// Representative catalog data lets a fresh PostgreSQL installation show a complete store.
const products: ProductSeed[] = [
  { slug: "bosch-impact-drill-650w", name: "Bosch 650W Impact Drill", brand: "Bosch", category: "Power Tools", icon: "🔩", mrp: 9800, price: 8500, stock: 12, image: photo.drill },
  { slug: "ingco-angle-grinder", name: "Ingco 850W Angle Grinder", brand: "Ingco", category: "Power Tools", icon: "⚙️", mrp: 7800, price: 6900, stock: 10, image: photo.drill },
  { slug: "assur-cordless-drill", name: "Assur 21V Cordless Drill", brand: "Assur", category: "Power Tools", icon: "🪛", mrp: 6250, price: 5100, stock: 18, image: photo.drill },
  { slug: "total-heat-gun", name: "Total 2000W Heat Gun", brand: "Total", category: "Power Tools", icon: "🔥", mrp: 4600, price: 3950, stock: 9, image: photo.drill },
  { slug: "stanley-tape-5m", name: "Stanley Powerlock Tape 5m", brand: "Stanley", category: "Hand Tools", icon: "📏", mrp: 650, price: 525, stock: 40, image: photo.hammer },
  { slug: "taparia-tool-kit", name: "Taparia 12-Piece Tool Kit", brand: "Taparia", category: "Hand Tools", icon: "🧰", mrp: 2400, price: 1990, stock: 20, image: photo.tools },
  { slug: "ingco-claw-hammer", name: "Ingco Claw Hammer 16oz", brand: "Ingco", category: "Hand Tools", icon: "🔨", mrp: 850, price: 720, stock: 30, image: photo.hammer },
  { slug: "tolsen-adjustable-wrench", name: "Tolsen Adjustable Wrench", brand: "Tolsen", category: "Hand Tools", icon: "🔧", mrp: 1050, price: 890, stock: 24, image: photo.tools },
  { slug: "karam-safety-helmet", name: "Karam Industrial Safety Helmet", brand: "Karam", category: "Safety & Welding", icon: "⛑️", mrp: 850, price: 650, stock: 30, image: photo.safety },
  { slug: "total-welding-gloves", name: "Total Leather Welding Gloves", brand: "Total", category: "Safety & Welding", icon: "🧤", mrp: 750, price: 550, stock: 25, image: photo.safety },
  { slug: "prescott-goggles", name: "Prescott Protective Goggles", brand: "Prescott", category: "Safety & Welding", icon: "🥽", mrp: 420, price: 350, stock: 38, image: photo.safety },
  { slug: "abc-fire-extinguisher", name: "ABC Fire Extinguisher 2kg", brand: "ABC", category: "Safety & Welding", icon: "🧯", mrp: 3600, price: 3100, stock: 14, image: photo.safety },
  { slug: "uni-t-multimeter", name: "UNI-T Digital Multimeter", brand: "UNI-T", category: "Electrical & Lighting", icon: "📟", mrp: 3400, price: 2800, stock: 15, image: photo.electrical },
  { slug: "philips-flood-light", name: "Philips LED Flood Light 50W", brand: "Philips", category: "Electrical & Lighting", icon: "💡", mrp: 2500, price: 1990, stock: 20, image: photo.electrical },
  { slug: "rathi-wiring-cable", name: "Rathi Copper Wiring Cable 90m", brand: "Rathi", category: "Electrical & Lighting", icon: "🔌", mrp: 6900, price: 6100, stock: 16, image: photo.electrical },
  { slug: "baltra-power-board", name: "Baltra 6-Socket Power Board", brand: "Baltra", category: "Electrical & Lighting", icon: "🔋", mrp: 1200, price: 950, stock: 35, image: photo.electrical },
  { slug: "garden-art-mower", name: "Garden Art Electric Lawn Mower", brand: "Garden Art", category: "Gardening Tools", icon: "🌱", mrp: 14500, price: 12400, stock: 5, image: photo.garden },
  { slug: "ingco-garden-hose", name: "Ingco Garden Hose Reel 20m", brand: "Ingco", category: "Gardening Tools", icon: "🚿", mrp: 3200, price: 2550, stock: 16, image: photo.garden },
  { slug: "dingqi-hedge-trimmer", name: "Dingqi Hedge Trimmer", brand: "Dingqi", category: "Gardening Tools", icon: "✂️", mrp: 7200, price: 6100, stock: 6, image: photo.garden },
  { slug: "ingco-pruning-shears", name: "Ingco Pro Pruning Shears", brand: "Ingco", category: "Gardening Tools", icon: "🌿", mrp: 900, price: 690, stock: 22, image: photo.garden },
  { slug: "baltra-electric-kettle", name: "Baltra Electric Kettle 1.8L", brand: "Baltra", category: "Home Appliances", icon: "🫖", mrp: 2900, price: 2350, stock: 20, image: photo.appliance },
  { slug: "karcher-vacuum-cleaner", name: "Karcher Compact Vacuum Cleaner", brand: "Karcher", category: "Home Appliances", icon: "🧹", mrp: 24000, price: 19900, stock: 4, image: photo.appliance },
  { slug: "cg-table-fan", name: "CG 16 Inch Table Fan", brand: "CG", category: "Home Appliances", icon: "🌀", mrp: 4200, price: 3500, stock: 13, image: photo.appliance },
  { slug: "baltra-room-heater", name: "Baltra 2000W Room Heater", brand: "Baltra", category: "Home Appliances", icon: "♨️", mrp: 3400, price: 2750, stock: 11, image: photo.appliance },
  { slug: "car-tyre-inflator", name: "Portable Tyre Inflator", brand: "Michelin", category: "Automotive Accessories", icon: "🚗", mrp: 4800, price: 3990, stock: 8, image: photo.auto },
  { slug: "wd40-lubricant", name: "WD-40 Multi-Use Lubricant", brand: "WD-40", category: "Automotive Accessories", icon: "🛢️", mrp: 950, price: 780, stock: 30, image: photo.auto },
  { slug: "car-wash-kit", name: "Car Wash & Detailing Kit", brand: "Total", category: "Automotive Accessories", icon: "🧽", mrp: 2800, price: 2290, stock: 12, image: photo.auto },
  { slug: "jumper-cable", name: "Heavy Duty Jumper Cables", brand: "Bosch", category: "Automotive Accessories", icon: "🔋", mrp: 2200, price: 1750, stock: 16, image: photo.auto },
  { slug: "master-lock-padlock", name: "Master Lock Steel Padlock", brand: "Master Lock", category: "Outdoor Hardware", icon: "🔒", mrp: 1250, price: 990, stock: 24, image: photo.tools },
  { slug: "ingco-step-ladder", name: "Ingco 5-Step Aluminium Ladder", brand: "Ingco", category: "Outdoor Hardware", icon: "🪜", mrp: 8200, price: 7200, stock: 7, image: photo.tools },
  { slug: "total-water-pump", name: "Total 1HP Water Pump", brand: "Total", category: "Outdoor Hardware", icon: "💧", mrp: 14200, price: 12500, stock: 4, image: photo.tools },
  { slug: "garden-wheelbarrow", name: "Heavy Duty Wheelbarrow", brand: "Garden Art", category: "Outdoor Hardware", icon: "🛞", mrp: 8600, price: 7600, stock: 5, image: photo.garden },
  { slug: "agri-knapsack-sprayer", name: "20L Knapsack Pressure Sprayer", brand: "Agripro", category: "Agriculture Tools", icon: "🌾", mrp: 4200, price: 3500, stock: 12, image: photo.farm },
  { slug: "agri-power-tiller", name: "Mini Power Tiller", brand: "Agripro", category: "Agriculture Tools", icon: "🚜", mrp: 98500, price: 89900, stock: 2, image: photo.farm },
  { slug: "agri-seed-spreader", name: "Hand Seed Spreader", brand: "Garden Art", category: "Agriculture Tools", icon: "🌻", mrp: 2500, price: 2100, stock: 10, image: photo.farm },
  { slug: "agri-harvest-sickle", name: "Carbon Steel Harvest Sickle", brand: "Taparia", category: "Agriculture Tools", icon: "🌿", mrp: 650, price: 495, stock: 40, image: photo.farm },
  { slug: "deli-stapler", name: "Deli Heavy Duty Stapler", brand: "Deli", category: "Office Essentials", icon: "📎", mrp: 1200, price: 980, stock: 22, image: photo.office },
  { slug: "deli-digital-safe", name: "Deli Digital Safe Box", brand: "Deli", category: "Office Essentials", icon: "🔐", mrp: 78000, price: 69500, stock: 3, image: photo.office },
  { slug: "uni-t-laser-measure", name: "UNI-T Laser Distance Meter", brand: "UNI-T", category: "Office Essentials", icon: "📐", mrp: 4800, price: 3990, stock: 11, image: photo.office },
  { slug: "office-label-maker", name: "Portable Label Maker", brand: "Deli", category: "Office Essentials", icon: "🏷️", mrp: 6500, price: 5400, stock: 8, image: photo.office },
];

async function main() {
  for (const product of products) {
    await db.product.upsert({ where: { slug: product.slug }, update: product, create: product });
  }
  console.log(`Seeded ${products.length} hardware products.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => db.$disconnect());
