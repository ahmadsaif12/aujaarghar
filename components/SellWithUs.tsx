"use client";

import Link from "next/link";
import { FormEvent, type ReactNode, useEffect, useRef, useState } from "react";

type IconName = "heart" | "box" | "cart" | "user" | "menu" | "search" | "store" | "headset" | "users" | "screen" | "price" | "products" | "web" | "delivery" | "form" | "expert" | "register" | "list" | "arrow" | "truck" | "wallet";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const shapes: Record<IconName, ReactNode> = {
    heart: <path d="M12 20.4S4.1 15.7 2.8 10.3C1.8 6.4 4.6 3.7 7.8 4.2c1.9.3 3.2 1.6 4.2 3.1 1-1.5 2.3-2.8 4.2-3.1 3.2-.5 6 2.2 5 6.1-1.3 5.4-9.2 10.1-9.2 10.1Z" />,
    box: <><path d="M5.1 7.4h13.8v12H5.1z" /><path d="M4.3 7.4 6 3.9h12l1.7 3.5M9 11.1h6" /></>,
    cart: <><path d="M3.6 4.7h2.1l1.8 10.1h10.7l1.6-7.2H6.2" /><circle cx="9.2" cy="19" r="1.25" /><circle cx="17.3" cy="19" r="1.25" /></>,
    user: <><circle cx="12" cy="7.3" r="3.5" /><path d="M4.7 20.2c1-3.9 3.4-5.9 7.3-5.9s6.3 2 7.3 5.9" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4.4 4.4" /></>,
    store: <><path d="M4 9.4h16v10.2H4zM3.2 9.4 5 4.5h14l1.8 4.9M8 19.6v-5h3.7v5M3.2 9.4c.6 1.8 2.8 1.8 3.6 0 .8 1.8 3 1.8 3.8 0 .8 1.8 3 1.8 3.8 0 .8 1.8 3 1.8 3.6 0" /></>,
    headset: <><path d="M4.6 13v-1a7.4 7.4 0 0 1 14.8 0v1" /><path d="M4.6 12.7H7v5.1H5.5a.9.9 0 0 1-.9-.9v-4.2ZM19.4 12.7H17v5.1h1.5a.9.9 0 0 0 .9-.9v-4.2ZM17 18c0 1.3-1 2.2-2.3 2.2h-2" /></>,
    users: <><circle cx="12" cy="7.5" r="3" /><circle cx="5.5" cy="9.3" r="2.3" /><circle cx="18.5" cy="9.3" r="2.3" /><path d="M6.5 20c.5-3.5 2.3-5.2 5.5-5.2s5 1.7 5.5 5.2M1.8 19.8c.2-2.7 1.5-4.1 4-4.1M22.2 19.8c-.2-2.7-1.5-4.1-4-4.1" /></>,
    screen: <><rect x="3" y="4.2" width="18" height="13.2" rx="1" /><path d="M8.5 20h7M12 17.4V20M6.7 8.3h4.2M6.7 11.5h7.2M16.3 8v4.4M14.2 10.2h4.2" /></>,
    price: <><path d="M12.1 3.1H7.3L3.5 7l9.4 9.4 7.6-7.6-8.4-5.7Z" /><circle cx="7.7" cy="7.5" r="1.2" /><path d="M16.6 17.3v3.1M14.5 20.4h4.2M18.8 14.8h.1" /></>,
    products: <><path d="m12 3.6 7.4 4.2v8.4L12 20.4l-7.4-4.2V7.8L12 3.6Z" /><path d="m4.6 7.8 7.4 4.2 7.4-4.2M12 12v8.4" /></>,
    web: <><rect x="3" y="4.3" width="18" height="14" rx="1.2" /><path d="M3 8h18M6 6.2h.1M8.5 6.2h.1M11 6.2h.1M7 12h4M7 14.5h7M15.8 11.5h2v3.7h-2z" /></>,
    delivery: <><path d="M3.8 6.1h10.9v10.2H3.8zM14.7 9.7h3l2.4 2.8v3.8h-5.4" /><circle cx="7.3" cy="18.1" r="1.5" /><circle cx="17.6" cy="18.1" r="1.5" /></>,
    form: <><rect x="5" y="3.4" width="14" height="17.2" rx="1.2" /><path d="M8.2 7.4h7.5M8.2 11.1h7.5M8.2 14.8h4.2M15.5 16.8l3.6-3.6 1.5 1.5-3.6 3.6-2.1.6.6-2.1Z" /></>,
    expert: <><path d="M4 19.9v-6.1l3.7-2.1 3.7 2.1v6.1M10.8 13.8l3.7-2.1 3.7 2.1v6.1" /><path d="M12 5.1 14.5 3l2.5 2.1V8H12zM5.7 16.8h1.6M13.7 16.8h1.6" /></>,
    register: <><rect x="5.2" y="3.6" width="13.6" height="16.8" rx="1.2" /><path d="M8.5 7.5h7M8.5 11.2h7M8.5 14.9h4.1M16.5 15.4l2 2M18.5 15.4l-2 2" /></>,
    list: <><rect x="4" y="4.1" width="16" height="15.8" rx="1.2" /><path d="M7.4 8h.1M10.1 8h6.4M7.4 12h.1M10.1 12h6.4M7.4 16h.1M10.1 16h6.4" /></>,
    arrow: <><circle cx="12" cy="12" r="9.2" /><path d="M8.7 12h6.5M12.5 8.7l3.3 3.3-3.3 3.3" /></>,
    truck: <><path d="M3.5 6h10.7v10.4H3.5zM14.2 9.6h3.2l2.5 3v3.8h-5.7" /><circle cx="7" cy="18" r="1.5" /><circle cx="17.3" cy="18" r="1.5" /><path d="M6.4 9.3h4.8M6.4 12h3.4" /></>,
    wallet: <><path d="M4.3 7.2h14.9a1.4 1.4 0 0 1 1.4 1.4v9.2a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 17.8V5.3A1.4 1.4 0 0 1 5.4 4h12.2" /><path d="M15.3 12h5.3v3.2h-5.3a1.6 1.6 0 0 1 0-3.2Z" /><circle cx="16" cy="13.6" r=".45" /></>,
  };
  return <svg className={`sell-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

const reasons: { icon: IconName; title: string }[] = [
  { icon: "users", title: "Reach wider audiences" },
  { icon: "screen", title: "Grow brand awareness" },
  { icon: "price", title: "Clear pricing knowledge" },
  { icon: "products", title: "Sell more products" },
  { icon: "web", title: "Build an online presence" },
  { icon: "delivery", title: "Expert product delivery" },
];

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "form", title: "Fill up the seller form", text: "Tell us about your business." },
  { icon: "expert", title: "Our expert will contact you", text: "Complete a quick onboarding call." },
  { icon: "register", title: "Register in under 5 minutes", text: "Submit the required documents." },
  { icon: "list", title: "List your products and sell", text: "Upload your best products and start selling." },
];

const shopCategories = [
  "Lights & Accessories",
  "Power Tools",
  "Safety & Welding Equipment",
  "Hand Tools",
  "Gardening Tools",
  "Office Essentials",
  "Agriculture Tools",
  "General Hardware",
  "Home Appliances",
  "Machinery",
  "Automotive Accessories",
  "Outdoor Hardware",
];

export default function SellWithUs() {
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState("");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeCategoryMenu(event: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) setCategoryMenuOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCategoryMenuOpen(false);
    }
    document.addEventListener("mousedown", closeCategoryMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeCategoryMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function submitVendor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
    setNotice("Thanks — your seller request is in. Our onboarding team will call you within one business day.");
  }

  return <div className="sell-page">
    <header className="site-header sell-site-header">
      <Link href="/" className="logo" aria-label="AujarGhar home"><span>Aujar</span><b>Ghar</b><small>.np</small></Link>
      <div className="header-actions sell-header-actions">
        <button className="header-action" type="button"><Icon name="heart" /><span>Wishlist</span></button>
        <button className="header-action" type="button"><Icon name="box" /><span>Track order</span></button>
        <Link className="header-action" href="/"><Icon name="cart" /><span>Cart</span></Link>
        <button className="header-action" type="button"><Icon name="user" /><span>Account <b className="account-caret" aria-hidden="true">⌄</b></span></button>
      </div>
    </header>

    <nav className="main-nav sell-nav" aria-label="Main navigation">
      <div className="category-control" ref={categoryMenuRef}>
        <button className="category-nav" type="button" onClick={() => setCategoryMenuOpen((open) => !open)} aria-expanded={categoryMenuOpen} aria-controls="seller-category-menu"><Icon name="menu" /> <span>All Categories</span></button>
        {categoryMenuOpen && <div id="seller-category-menu" className="seller-category-menu" role="menu">{shopCategories.map((category) => <Link href="/" role="menuitem" key={category} onClick={() => setCategoryMenuOpen(false)}>{category}</Link>)}</div>}
      </div>
      <form className="header-search" action="/" role="search"><Icon name="search" /><input name="q" placeholder="What are you looking for?" aria-label="Search products" /><button type="submit">Search</button></form>
      <Link href="/sell-with-us" className="sell-link sell-link-current"><Icon name="store" /><span>Sell with us</span></Link>
      <a href="tel:9811763721" className="hotline"><Icon name="headset" /><span>Hotline</span> 9811763721</a>
    </nav>

    <main className="sell-main">
      <section className="seller-hero" aria-labelledby="seller-title">
        <div className="seller-hero-art" aria-hidden="true">
          <span className="art-orb art-orb-one" /><span className="art-orb art-orb-two" /><span className="art-plane" />
          <div className="art-screen"><div className="art-screen-top"><span /><span /><i /></div><div className="art-awning"><i /><i /><i /><i /><i /></div><div className="art-products"><b>◒</b><b>◈</b><b>◉</b></div></div>
          <div className="art-cart"><span /><i /><i /></div><div className="art-bag art-bag-one" /><div className="art-bag art-bag-two" />
        </div>
        <div className="seller-intro"><p className="seller-kicker">SELL WITH AUJARGHAR</p><h1 id="seller-title">Take your business<br /><strong>online with us.</strong></h1><span className="seller-underline" /><p>Grow your business beyond your shop. Sell on AujarGhar in a simple, trusted way.</p></div>
        <form className="seller-form" onSubmit={submitVendor}>
          <h2>Sell With Us</h2>
          <div className="seller-form-rule" />
          <label className="seller-field seller-wide"><span>Company name <em>*</em></span><input required name="company" maxLength={120} placeholder="Enter company name" /></label>
          <div className="seller-field-row"><label className="seller-field"><span>PAN number <em>*</em></span><input required name="panNumber" maxLength={35} placeholder="Enter PAN number" /></label><label className="seller-field"><span>Phone number <em>*</em></span><input required type="tel" name="phone" maxLength={30} inputMode="tel" placeholder="Enter phone number" /></label></div>
          <label className="seller-field seller-wide"><span>Choose city <em>*</em></span><select required name="city" defaultValue=""><option value="" disabled>Select city</option><option>Kathmandu</option><option>Pokhara</option><option>Biratnagar</option><option>Butwal</option><option>Chitwan</option></select></label>
          <div className="seller-field-row"><label className="seller-field"><span>Address <em>*</em></span><input required name="address" maxLength={200} placeholder="Enter address" /></label><label className="seller-field"><span>Designated person <em>*</em></span><input required name="contactName" maxLength={80} placeholder="Enter contact name" /></label></div>
          <label className="seller-field seller-wide"><span>Choose category <em>*</em></span><select required name="category" defaultValue=""><option value="" disabled>Select category</option><option>Power tools</option><option>Hand tools</option><option>Electrical and lighting</option><option>Home appliances</option><option>Other hardware</option></select></label>
          <div className="seller-field-row"><label className="seller-field"><span>Email <em>*</em></span><input required type="email" name="email" maxLength={160} placeholder="Enter email address" /></label><label className="seller-field"><span>Vendor type <em>*</em></span><select required name="vendorType" defaultValue=""><option value="" disabled>Select vendor type</option><option>Manufacturer</option><option>Distributor</option><option>Retailer</option></select></label></div>
          <div className="seller-form-bottom"><button className="seller-submit" type="submit">Submit now</button>{notice && <p className="seller-notice" role="status">{notice}</p>}</div>
        </form>
      </section>

      <section className="why-sell" aria-labelledby="why-sell-title">
        <div className="sell-section-heading"><h2 id="why-sell-title">Why Sell With Us</h2><span /></div>
        <p className="why-sell-copy">In just 5 years, we&apos;ve delivered goods to more than 50,000 households and continuing. Our marketplace gives your platform the reach to find wider audiences and grow brand awareness at no cost.</p>
        <div className="reason-grid">{reasons.map((reason) => <article className="reason-card" key={reason.title}><Icon name={reason.icon} /><h3>{reason.title}</h3></article>)}</div>
      </section>

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <div className="sell-section-heading"><h2 id="how-it-works-title">How It Works</h2><span /></div>
        <p className="how-copy">We have a simple model for getting your business online.</p>
        <div className="steps-grid">{steps.map((step, index) => <div className="work-step" key={step.title}><div className="step-icon"><Icon name={step.icon} /></div><h3>{step.title}</h3><p>{step.text}</p>{index < steps.length - 1 && <Icon name="arrow" className="step-arrow" />}</div>)}</div>
      </section>
    </main>

    <section className="support-strip seller-support"><div><Icon name="truck" /><p><b>Fast delivery guaranteed</b><small>Place your orders today, get your package delivered the very next day.</small></p></div><div><Icon name="wallet" /><p><b>Cash on delivery</b><small>Pay safely for your order when it reaches your door.</small></p></div><div><Icon name="headset" /><p><b>Online support</b><small>Our support team can help with any order-related inquiry.</small></p></div></section>
    <footer className="seller-footer"><div className="seller-footer-main"><section><h3>AUJARGHAR</h3><Link href="/">About us</Link><a href="#">Privacy policy</a><a href="#">Terms &amp; conditions</a></section><section><h3>CUSTOMER SERVICE</h3><a href="#">FAQs</a><a href="#">Refunds &amp; returns</a><a href="#">Safe &amp; secure shopping</a></section><section><h3>SHOP</h3><Link href="/">Categories</Link><a href="#">Delivery</a><a href="#">Contact us</a></section><section><h3>SERVICE HOURS</h3><p>11:00 AM to 6:00 PM (NST)</p><h3 className="footer-hotline-title">HOTLINE</h3><a className="seller-phone" href="tel:9811763721">9811763721</a></section><form className="seller-subscribe" onSubmit={(event) => { event.preventDefault(); const target = event.currentTarget; target.classList.add("is-subscribed"); }}><label>Subscribe to newsletter</label><input type="email" required placeholder="Enter email address" aria-label="Subscribe email address" /><button>Subscribe now</button><span>Thanks — you&apos;re subscribed!</span></form></div><div className="seller-footer-bottom">© {new Date().getFullYear()} AujarGhar. All rights reserved.</div></footer>
  </div>;
}
