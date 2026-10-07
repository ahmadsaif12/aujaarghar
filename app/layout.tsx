import "./globals.css";

// Wraps every page with the page title and base HTML.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><head><title>AujarGhar – Hardware Store</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body>{children}</body></html>);
}
