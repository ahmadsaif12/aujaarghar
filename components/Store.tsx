"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Product = { id: number; slug: string; name: string; brand: string; category: string; price: number; mrp: number; stock: number; icon: string; image: string };
type Cart = Record<number, number>;
type User = { id: number; name: string; email: string };

type HeaderIconName = "wishlist" | "orders" | "cart" | "account";

function HeaderIcon({ name }: { name: HeaderIconName }) {
  const paths = {
    wishlist: <path d="M12 20.5s-7-4.35-9.35-8.47C.65 8.55 2.3 4.5 6.28 4.5c2.17 0 3.42 1.17 4.25 2.52.83-1.35 2.08-2.52 4.25-2.52 3.98 0 5.63 4.05 3.63 7.53C16.07 16.15 12 20.5 12 20.5Z" />,
    orders: <><path d="M6.5 4.5h11l1 4.1v11.9H5.5V8.6l1-4.1Z" /><path d="M5.5 8.6h13M9 4.5v4.1M15 4.5v4.1M9.1 13h5.8" /></>,
    cart: <><path d="M3.5 4.5h2l1.75 10.05h10.4l1.55-7.2H6.25" /><circle cx="9" cy="19" r="1.25" /><circle cx="17" cy="19" r="1.25" /></>,
    account: <><circle cx="12" cy="7.25" r="3.75" /><path d="M4.8 20.25c.9-4.05 3.34-6.08 7.2-6.08s6.3 2.03 7.2 6.08c-1.98 1.05-4.38 1.57-7.2 1.57s-5.22-.52-7.2-1.57Z" /></>,
  };

  return <svg className="header-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

const rs = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;
const categoryMeta: Record<string, { icon: string; short: string }> = {
  "Power Tools": { icon: "⚡", short: "Power Tools" },
  "Hand Tools": { icon: "🔧", short: "Hand Tools" },
  "Safety & Welding": { icon: "⛑", short: "Safety Gear" },
  "Electrical & Lighting": { icon: "💡", short: "Lights" },
  "Gardening Tools": { icon: "🌱", short: "Gardening" },
  "Home Appliances": { icon: "⌂", short: "Appliances" },
  "Automotive Accessories": { icon: "🚗", short: "Automotive" },
  "Outdoor Hardware": { icon: "🔒", short: "Outdoor" },
  "Agriculture Tools": { icon: "🚜", short: "Agriculture" },
  "Office Essentials": { icon: "▣", short: "Office" },
};

export default function Store({ products }: { products: Product[] }) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({});
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [payment, setPayment] = useState<"cod" | "stripe">("cod");
  const [message, setMessage] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].slice(0, 12), [products]);
  const results = useMemo(() => products.filter((p) => {
    const haystack = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
    return (category === "All" || p.category === category) && haystack.includes(term.trim().toLowerCase());
  }), [category, products, term]);
  const cartLines = products.filter((p) => cart[p.id] > 0);
  const cartCount = cartLines.reduce((sum, product) => sum + cart[product.id], 0);
  const total = cartLines.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const browsing = category !== "All" || term.trim().length > 0;

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.ok ? response.json() : null).then((data) => setUser(data?.user ?? null)).catch(() => undefined);
  }, []);

  useEffect(() => {
    function closeAccountMenu(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) setAccountOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountOpen(false);
    }
    document.addEventListener("mousedown", closeAccountMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeAccountMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function showCategory(next: string) {
    setCategory(next); setTerm(""); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function add(product: Product) {
    setCart((previous) => ({ ...previous, [product.id]: Math.min((previous[product.id] ?? 0) + 1, product.stock) }));
    setMessage(""); setCartOpen(true);
  }
  function change(product: Product, delta: number) {
    setCart((previous) => {
      const quantity = Math.max(0, Math.min(product.stock, (previous[product.id] ?? 0) + delta));
      const next = { ...previous };
      if (quantity === 0) delete next[product.id]; else next[product.id] = quantity;
      return next;
    });
  }
  async function placeOrder() {
    setMessage("");
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, payment, items: cartLines.map((product) => ({ id: product.id, qty: cart[product.id] })) }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "We could not place your order. Please try again.");
    if (data.url) { window.location.href = data.url; return; }
    setCart({}); setMessage(`Order #${data.orderId} is confirmed. We will call you shortly.`);
  }
  function openAuth(mode: "login" | "register") {
    setAuthMode(mode); setAuthMessage(""); setAccountOpen(false); setAuthOpen(true);
  }
  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAuthMessage("");
    const response = await fetch(`/api/auth/${authMode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(authMode === "login" ? { email: authForm.email, password: authForm.password } : authForm) });
    const data = await response.json();
    if (!response.ok) return setAuthMessage(data.error ?? "We could not complete that request.");
    setUser(data.user); setAuthOpen(false); setAuthForm({ name: "", phone: "", email: "", password: "" });
  }
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }); setUser(null); setAccountOpen(false);
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const discount = product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0;
    return <article className="product-card">
      <div className="product-image-wrap">
        {discount > 0 && <span className="discount">Save {discount}%</span>}
        <button className="wish" aria-label={`Add ${product.name} to wishlist`}>♡</button>
        <img className="product-image" src={product.image} alt={product.name} onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <span className="product-fallback" aria-hidden="true">{product.icon}</span>
      </div>
      <p className="brand">{product.brand}</p><h3>{product.name}</h3>
      <div className="price-row"><strong>{rs(product.price)}</strong>{discount > 0 && <del>{rs(product.mrp)}</del>}</div>
      <button className="add-button" disabled={!product.stock} onClick={() => add(product)}>{product.stock ? "Add to cart" : "Out of stock"}</button>
    </article>;
  };
  const ProductSection = ({ title, list, target }: { title: string; list: Product[]; target?: string }) => <section className="section">
    <div className="section-title"><h2>{title}</h2>{target && <button onClick={() => showCategory(target)}>See all <span>›</span></button>}</div>
    <div className="product-grid">{list.map((product) => <ProductCard key={product.id} product={product} />)}</div>
  </section>;

  return <>
    <header className="site-header">
      <button className="logo" onClick={() => showCategory("All")} aria-label="AujarGhar home"><span>Aujar</span><b>Ghar</b><small>.np</small></button>
      <div className="header-actions">
        <button className="header-action" aria-label="Wishlist"><HeaderIcon name="wishlist" /><span>Wishlist</span></button>
        <button className="header-action" aria-label="Track order"><HeaderIcon name="orders" /><span>Track order</span></button>
        <button className="header-action" onClick={() => setCartOpen(true)} aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}><HeaderIcon name="cart" /><span>Cart {cartCount > 0 && <em>{cartCount}</em>}</span></button>
        <div className="account-menu" ref={accountMenuRef} onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
          <button className="header-action" onClick={() => setAccountOpen(true)} onFocus={() => setAccountOpen(true)} aria-expanded={accountOpen} aria-controls="account-dropdown"><HeaderIcon name="account" /><span>{user ? user.name.split(" ")[0] : "Account"} <b className="account-caret" aria-hidden="true">⌄</b></span></button>
          {accountOpen && <div id="account-dropdown" className="account-dropdown">{user ? <><p>Hi, {user.name}</p><small>{user.email}</small><button onClick={logout}>Log out</button></> : <><button onClick={() => openAuth("login")}>Login</button><button onClick={() => openAuth("register")}>Register</button></>}</div>}
        </div>
      </div>
    </header>
    <nav className="main-nav"><button className="category-nav" onClick={() => showCategory("All")}><span>☰</span> Categories</button><div className="header-search"><span>⌕</span><input value={term} onChange={(event) => { setTerm(event.target.value); setCategory("All"); }} placeholder="What are you looking for?" aria-label="Search products" /><button aria-label="Search products">Search</button></div><button className="sell-link" onClick={() => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })}>♧ <span>Sell with us</span></button><a href="tel:9811763721" className="hotline">🎧 <span>Hotline</span> 9811763721</a></nav>
    <main>
      <div className="hero-layout">
        <aside className="category-menu"><div className="menu-heading">Shop Categories</div><button className={category === "All" ? "active" : ""} onClick={() => showCategory("All")}>All products <span>›</span></button>{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => showCategory(item)}><span>{categoryMeta[item]?.icon}</span>{item}<b>›</b></button>)}</aside>
        <section className="hero"><div className="hero-copy"><p className="eyebrow">BUILT FOR THE LAND</p><h1><mark>Agriculture</mark><br />Tools</h1><p>Dependable tools for the farm, workshop and every hard-working home.</p><button onClick={() => showCategory("Agriculture Tools")}>Shop now <span>→</span></button></div><div className="hero-visual" aria-hidden="true"><span className="hero-ring ring-one" /><span className="hero-ring ring-two" /><span className="hero-tool">🚜</span><span className="hero-tool second">🌾</span></div></section>
      </div>
      <div className="mobile-categories">{["All", ...categories].map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => showCategory(item)}>{item === "All" ? "All products" : categoryMeta[item]?.short ?? item}</button>)}</div>
      <section className="benefits"><button><span>🚚</span><p><b>Free Delivery</b><small>Across Nepal</small></p></button><button onClick={() => document.getElementById("hot-deals")?.scrollIntoView({ behavior: "smooth" })}><span>🔥</span><p><b>Hot Deals</b><small>Save on essentials</small></p></button><button><span>▤</span><p><b>Blogs</b><small>Tool tips &amp; guides</small></p></button><button onClick={() => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })}><span>٪</span><p><b>Sell With Us</b><small>Grow your business</small></p></button><button onClick={() => document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" })}><span>✦</span><p><b>New Arrivals</b><small>Just added</small></p></button></section>
      {browsing ? <ProductSection title={term ? `Results for “${term}”` : category} list={results} /> : <>
        <div className="promo-grid"><section className="promo-card orange"><div><span>POWER UP YOUR WORKDAY</span><h2>Heavy-duty<br />power tools</h2><button onClick={() => showCategory("Power Tools")}>Explore now →</button></div><i>⚙</i></section><section className="promo-card light"><div><span>HOME ESSENTIALS</span><h2>Smarter tools.<br /><mark>Better living.</mark></h2><button onClick={() => showCategory("Home Appliances")}>Shop appliances →</button></div><i>⌂</i></section></div>
        <div id="new-arrivals"><ProductSection title="Best selling tools" list={products.slice(0, 5)} /></div>
        <section className="section categories-section"><div className="section-title"><h2>Featured categories</h2><button onClick={() => showCategory("All")}>Browse all <span>›</span></button></div><div className="category-tiles">{categories.map((item) => <button key={item} onClick={() => showCategory(item)}><span>{categoryMeta[item]?.icon}</span><b>{item}</b><small>Shop now →</small></button>)}</div></section>
        <section id="brands" className="section brands-section"><div className="section-title"><h2>Shop by brands</h2></div><div className="brand-grid">{brands.map((brand) => <button key={brand} onClick={() => { setTerm(brand); setCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{brand}</button>)}</div></section>
        <section id="hot-deals"><ProductSection title="Hot deals" list={products.filter((product) => product.mrp > product.price).slice(5, 10)} /></section>
        <section className="wide-promo"><div><p>GARDEN &amp; OUTDOOR</p><h2>Make every outdoor job simpler.</h2><button onClick={() => showCategory("Gardening Tools")}>Shop garden tools →</button></div><span>🌿</span></section>
        {categories.slice(0, 4).map((item) => <ProductSection key={item} title={item} target={item} list={products.filter((product) => product.category === item).slice(0, 5)} />)}
      </>}
      {browsing && results.length === 0 && <div className="empty-state"><span>⌕</span><h2>Nothing matched your search</h2><p>Try a tool name, brand or a different category.</p><button onClick={() => { setTerm(""); setCategory("All"); }}>View all products</button></div>}
    </main>
    <section className="support-strip"><div><span>🚚</span><p><b>Fast delivery guaranteed</b><small>We bring your hardware order to your door.</small></p></div><div><span>💵</span><p><b>Cash on delivery</b><small>Pay safely when your package arrives.</small></p></div><div><span>☎</span><p><b>Need help choosing?</b><small>Talk to our hardware experts.</small></p></div></section>
    <footer id="footer"><div className="footer-main"><section><button className="logo footer-logo" onClick={() => showCategory("All")}><span>Aujar</span><b>Ghar</b><small>.np</small></button><p>Your local online destination for trusted tools, hardware and home essentials.</p><a className="footer-phone" href="tel:9811763721">☎ 9811763721</a></section><section><h3>Customer service</h3><a>Help center</a><a>Track your order</a><a>Shipping &amp; delivery</a><a>Returns &amp; refunds</a></section><section><h3>Shop</h3><a onClick={() => showCategory("Power Tools")}>Power tools</a><a onClick={() => showCategory("Hand Tools")}>Hand tools</a><a onClick={() => showCategory("Gardening Tools")}>Gardening tools</a><a onClick={() => showCategory("Home Appliances")}>Home appliances</a></section><section><h3>Stay in the loop</h3><p>Get new deals and hardware tips in your inbox.</p><form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input required type="email" placeholder="Your email address" aria-label="Email address" /><button>Subscribe</button></form>{subscribed && <small className="subscribed">Thanks — you’re subscribed!</small>}</section></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AujarGhar. All rights reserved.</span><span>Secure shopping · Cash on delivery · Nepal</span></div></footer>
    {authOpen && <div className="auth-layer" role="presentation"><button className="auth-backdrop" aria-label="Close account dialog" onClick={() => setAuthOpen(false)} /><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="auth-close" onClick={() => setAuthOpen(false)} aria-label="Close">×</button><p className="auth-kicker">AUJARGHAR ACCOUNT</p><h2 id="auth-title">{authMode === "login" ? "Welcome back" : "Create your account"}</h2><p className="auth-intro">{authMode === "login" ? "Log in to see your orders and shop faster." : "Register once for quicker checkout and order updates."}</p><form className="auth-form" onSubmit={submitAuth}>{authMode === "register" && <><label>Full name<input required maxLength={80} value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} /></label><label>Phone number <small>(optional)</small><input maxLength={30} inputMode="tel" value={authForm.phone} onChange={(event) => setAuthForm({ ...authForm, phone: event.target.value })} /></label></>}<label>Email address<input required type="email" autoComplete="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} /></label><label>Password<input required minLength={8} type="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} /></label>{authMessage && <p className="auth-error">{authMessage}</p>}<button className="auth-submit">{authMode === "login" ? "Login" : "Create account"}</button></form><p className="auth-switch">{authMode === "login" ? "New to AujarGhar?" : "Already have an account?"} <button onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthMessage(""); }}>{authMode === "login" ? "Register" : "Login"}</button></p></section></div>}
    <div className={cartOpen ? "cart-shade visible" : "cart-shade"} onClick={() => setCartOpen(false)} />
    <aside className={cartOpen ? "cart-drawer open" : "cart-drawer"} aria-hidden={!cartOpen}><div className="cart-head"><div><p>Your cart</p><small>{cartCount} item{cartCount === 1 ? "" : "s"}</small></div><button onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div><div className="cart-items">{cartLines.length === 0 ? <div className="empty-cart"><span>🛒</span><p>Your cart is empty</p><button onClick={() => setCartOpen(false)}>Continue shopping</button></div> : cartLines.map((product) => <div className="cart-line" key={product.id}><div className="cart-thumb"><img src={product.image} alt="" /><span>{product.icon}</span></div><div className="cart-product"><b>{product.name}</b><small>{rs(product.price)}</small><div className="quantity"><button onClick={() => change(product, -1)} aria-label={`Remove one ${product.name}`}>−</button><span>{cart[product.id]}</span><button onClick={() => change(product, 1)} disabled={cart[product.id] >= product.stock} aria-label={`Add one ${product.name}`}>+</button></div></div><strong>{rs(product.price * cart[product.id])}</strong></div>)}</div>{cartLines.length > 0 && <div className="checkout"><div className="total"><span>Subtotal</span><b>{rs(total)}</b></div><p className="checkout-note">Delivery charge is confirmed when we call.</p><input placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input placeholder="Phone number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /><textarea placeholder="Delivery address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /><label className="payment-select">Payment method<select value={payment} onChange={(event) => setPayment(event.target.value as "cod" | "stripe")}><option value="cod">Cash on delivery</option><option value="stripe">Card payment (Stripe test)</option></select></label><button className="checkout-button" onClick={placeOrder}>{payment === "stripe" ? "Continue to payment" : "Place cash-on-delivery order"}</button>{message && <p className="checkout-message">{message}</p>}</div>}</aside>
  </>;
}
