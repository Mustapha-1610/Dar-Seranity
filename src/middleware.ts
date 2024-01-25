import { NextRequest, NextResponse } from "next/server";
import landlord from "./Modals/UsersModals/landlord";
async function verifyToken(token: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verifyToken/renter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data.isValid;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const publicRoutes = ["/", "/login", "/signup"];
  const { pathname } = req.nextUrl;
  if (publicRoutes.includes(pathname)) {
    const renterToken = req.cookies.get("refreshRenterToken")?.value || "";
    const landlorToken = req.cookies.get("refreshLandlordToken")?.value || "";

    if (renterToken) {
      const isValid = await verifyToken(renterToken);
      if (isValid) {
        const renterProfileUrl = new URL("/renter/profile", req.nextUrl.origin);
        return NextResponse.redirect(renterProfileUrl);
      }
    } else {
      const landlorToken = req.cookies.get("refreshLandlordToken")?.value || "";
      if (landlorToken) {
        const isValid = await verifyToken(landlorToken);
        if (isValid) {
          const landlordProfileUrl = new URL(
            "/landlord/profile",
            req.nextUrl.origin
          );
          return NextResponse.redirect(landlordProfileUrl);
        }
      } else {
        return NextResponse.next();
      }
    }
  }

  if (!pathname.startsWith("/renter") && !pathname.startsWith("/landlord")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/landlord")) {
    const landlorToken = req.cookies.get("refreshLandlordToken")?.value || "";
    if (landlorToken) {
      const isValid = await verifyToken(landlorToken);
      if (!isValid) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
      }
      if (publicRoutes.includes(pathname)) {
        const dashboardUrl = new URL("/landord", req.nextUrl.origin);
        return NextResponse.redirect(dashboardUrl);
      }
    } else {
      if (!publicRoutes.includes(pathname)) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }
  if (pathname.startsWith("/renter")) {
    const renterToken = req.cookies.get("refreshRenterToken")?.value || "";
    if (renterToken) {
      const isValid = await verifyToken(renterToken);
      if (!isValid) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
      }
      if (publicRoutes.includes(pathname)) {
        const dashboardUrl = new URL("/renter", req.nextUrl.origin);
        return NextResponse.redirect(dashboardUrl);
      }
    } else {
      if (!publicRoutes.includes(pathname)) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}
