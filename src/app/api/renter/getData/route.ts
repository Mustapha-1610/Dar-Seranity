import { NextResponse, NextRequest } from "next/server";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyRenterToken(request);

    if (routeProtectionResponse.isValid) {
      const renterFrontData = returnRenterObject(
        routeProtectionResponse.renterAccount
      );
      return refreshAccessToken(
        renterFrontData,
        routeProtectionResponse.newAccessToken
      );
    } else {
      return routeProtectionResponse.response;
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" });
  }
}
