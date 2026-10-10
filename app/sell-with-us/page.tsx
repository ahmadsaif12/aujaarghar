import type { Metadata } from "next";
import SellWithUs from "@/components/SellWithUs";

export const metadata: Metadata = {
  title: "Sell With Us | AujarGhar",
  description: "Join AujarGhar and sell your hardware and home products online.",
};

export default function SellWithUsPage() {
  return <SellWithUs />;
}
