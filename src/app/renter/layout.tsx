import "../globals.css";
import RenterNavbar from "@/app/components/renterNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RenterNavbar />
        {children}
      </body>
    </html>
  );
}
