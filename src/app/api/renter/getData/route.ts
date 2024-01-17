import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import renter from "@/Modals/UsersModals/renter";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
export async function GET(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyRenterToken(request);

    if (routeProtectionResponse.isValid) {
      const renterData = {
        name: routeProtectionResponse.renterAccount.name,
        surname: routeProtectionResponse.renterAccount.surname,
        email: routeProtectionResponse.renterAccount.email,
      };
      return refreshAccessToken(
        renterData,
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
