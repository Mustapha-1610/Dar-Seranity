import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import cookie from "cookie";
const publicRoutes = ["/", "/login", "/signup"];

export default function middleware(req: NextRequest) {
  const renterToken = req.cookies.get("refreshRenterToken")?.value || "";
  if (!renterToken && req.nextUrl.pathname.startsWith("/renter")) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (renterToken && publicRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/renter", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
