import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import renter from "@/Modals/UsersModals/renter";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";

export async function GET(request: NextRequest) {
  try {
    const routeProtectionResponse = await verifyRenterToken(request);

    if (routeProtectionResponse.isValid) {
      const response = NextResponse.json({
        success: "Valid",
        account: routeProtectionResponse.renterAccount,
      });
      response.cookies.set(
        "accessRenterToken",
        routeProtectionResponse.newAccessToken!,
        {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        }
      );
      return response;
    } else {
      return routeProtectionResponse.response;
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" });
  }
}
