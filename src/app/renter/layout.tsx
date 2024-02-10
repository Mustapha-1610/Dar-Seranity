import "../globals.css";
import RenterNavbar from "@/app/components/renterNavbar";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RenterNavbar />
      {children}
      <SpeedInsights />
    </>
  );
}
