import type { Metadata } from "next";
import "../globals.css";
import LandlordNavbar from "../components/landlordNavbar";

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
    </>
  );
}
