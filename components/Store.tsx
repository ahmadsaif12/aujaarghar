"use client";
import { useState } from "react";

type Product = { id: number; name: string; brand: string; category: string; price: number; mrp: number; stock: number; icon: string };
const rs = (n: number) => "Rs. " + n.toLocaleString("en-IN");

// Shows the full store: header, categories, banner, product sections, cart and footer.
export default function Store({ products }: { products: Product[] }) {
  const [term, setTerm] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [pay, setPay] = useState<"cod" | "stripe">("cod");
  const [msg, setMsg] = useState("");

  const cats = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const filtered = products.filter((p) => (cat === "All" || p.category === cat) && (p.name + p.brand + p.category).toLowerCase().includes(term.toLowerCase()));
  const lines = products.filter((p) => cart[p.id]);
  const total = lines.reduce((s, p) => s + p.price * cart[p.id], 0);
  const count = lines.reduce((s, p) => s + cart[p.id], 0);
  const deals = products.filter((p) => p.mrp > p.price);
  const browsing = cat !== "All" || term !== "";

  // Adds one unit of a product to the cart, up to the available stock.
  const add = (p: Product) => { setCart((c) => ({ ...c, [p.id]: Math.min((c[p.id] ?? 0) + 1, p.stock) })); setOpen(true); };

  // Changes the quantity of a cart item by +1 or -1.
  const change = (id: number, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  // Sends the order to the server and clears the cart on success.
  async function placeOrder() {
    const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, payment: pay, items: lines.map((p) => ({ id: p.id, qty: cart[p.id] })) }) });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error);
    if (data.url) { window.location.href = data.url; return; }
    setCart({}); setMsg(`Order #${data.orderId} placed. We will call you to confirm delivery.`);
  }

  // Draws one product card with price, discount and add button.
  const Card = ({ p }: { p: Product }) => (
    <div className="card">
      {p.mrp > p.price && <span className="tag">-{Math.round(100 - (p.price * 100) / p.mrp)}%</span>}
      <div className="icon">{p.icon}</div><div className="mute">{p.brand}</div><b className="pname">{p.name}</b>
      <div><b>{rs(p.price)}</b> {p.mrp > p.price && <span className="old">{rs(p.mrp)}</span>}</div>
      <button className="btn" disabled={p.stock < 1} onClick={() => add(p)}>{p.stock < 1 ? "Out of stock" : "Add to Cart"}</button>
    </div>);

  // Draws a titled row of products with a "See all" link.
  const Section = ({ title, list, to }: { title: string; list: Product[]; to?: string }) => (
    <section className="sec"><div className="sech"><h2>{title}</h2>{to && <a onClick={() => { setCat(to); window.scrollTo(0, 0); }}>See all &gt;</a>}</div><div className="row">{list.map((p) => <Card key={p.id} p={p} />)}</div></section>);

  return (<>
    <div className="top"><span>Hotline: 98XXXXXXXX</span><span>Track Order · Wishlist · Login · Register</span></div>
    <header>
      <a className="logo" onClick={() => { setCat("All"); setTerm(""); }}>Aujar<b>Ghar</b></a>
      <input className="search" placeholder="Search tools, brands, categories…" value={term} onChange={(e) => setTerm(e.target.value)} />
      <button className="cartbtn" onClick={() => setOpen(true)}>🛒 Cart ({count})</button>
    </header>
    <nav className="nav"><span className="allc">☰ All Categories</span>
      {["Free Delivery", "Hot Deals", "New Arrivals", "Sell With Us"].map((x) => <a key={x}>{x}</a>)}</nav>
    <main>
      <div className="top2">
        <ul className="side"><li onClick={() => setCat("All")}>All Products</li>{cats.map((c) => <li key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>{c}</li>)}</ul>
        <div className="hero"><div><h1>Dashain Sale: up to 40% off tools</h1><p>Power tools, hand tools, safety gear and more. Cash on delivery in Kathmandu Valley.</p><button className="btn" onClick={() => setCat("Power Tools")}>Shop Power Tools</button></div><div className="big">🛠️</div></div>
      </div>
      <div className="chips">{["All", ...cats].map((c) => <button key={c} className={c === cat ? "chip on" : "chip"} onClick={() => setCat(c)}>{c}</button>)}</div>
      <div className="perks"><div>🚚 <b>Fast Delivery</b><br /><span className="mute">Next-day in the valley</span></div><div>💵 <b>Cash on Delivery</b><br /><span className="mute">Pay when it arrives</span></div><div>🎧 <b>Online Support</b><br /><span className="mute">11 AM to 6 PM</span></div></div>
      {browsing ? <Section title={cat === "All" ? "Search results" : cat} list={filtered} /> : <>
        <Section title="Best Selling" list={products.slice(0, 8)} />
        <section className="sec"><div className="sech"><h2>Featured Categories</h2></div><div className="tiles">{cats.map((c) => <div key={c} className="tile" onClick={() => setCat(c)}><span>{products.find((p) => p.category === c)?.icon}</span>{c}</div>)}</div></section>
        <Section title="Hot Deals" list={deals.slice(0, 8)} />
        <section className="sec"><div className="sech"><h2>Shop by Brands</h2></div><div className="chips">{brands.map((b) => <button key={b} className="chip" onClick={() => setTerm(b)}>{b}</button>)}</div></section>
        {cats.map((c) => <Section key={c} title={c} to={c} list={products.filter((p) => p.category === c).slice(0, 6)} />)}</>}
      {browsing && !filtered.length && <p className="mute">No products found.</p>}
    </main>
    <footer><div><b>AujarGhar</b><br />About Us · Privacy Policy · Terms</div><div><b>Customer Service</b><br />FAQs · Refund and Returns · Delivery</div><div><b>Service Hours</b><br />11:00 AM to 6:00 PM<br />Hotline: 98XXXXXXXX</div></footer>
    <aside className={open ? "cart open" : "cart"}>
      <div className="sech"><h2>Your cart</h2><button className="x" onClick={() => setOpen(false)}>×</button></div>
      {lines.map((p) => <div className="line" key={p.id}><span>{p.name}<br /><span className="mute">{rs(p.price)}</span></span><span><button onClick={() => change(p.id, -1)}>−</button> {cart[p.id]} <button onClick={() => change(p.id, 1)}>+</button></span></div>)}
      {!lines.length && <p className="mute">Your cart is empty. Add a product to start.</p>}
      <b>Total: {rs(total)}</b>
      <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <select value={pay} onChange={(e) => setPay(e.target.value as "cod" | "stripe")}><option value="cod">Cash on delivery</option><option value="stripe">Pay online – Stripe (test)</option></select>
      <button className="btn" onClick={placeOrder}>{pay === "stripe" ? "Pay with card" : "Place order"}</button>
      {msg && <div className="mute">{msg}</div>}
    </aside>
  </>);
}
