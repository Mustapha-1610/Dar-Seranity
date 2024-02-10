import type { Metadata } from "next";
import "../globals.css";
import LandlordNavbar from "../components/landlordNavbar";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Dar-Seranity",
  description: "Internship Project By Mustapha Talbi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandlordNavbar />
      {children}
      <SpeedInsights />
    </>
  );
}
