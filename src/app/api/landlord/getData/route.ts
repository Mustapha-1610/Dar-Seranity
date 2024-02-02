import { NextResponse, NextRequest } from "next/server";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { refreshLandlordToken } from "@/Helpers/RouteProtection/refreshLandlordToken";
import { returnLandlordObject } from "@/Helpers/backFunctions/returnLandlordObject";
import { connect } from "@/DataBase/dbConfig";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyLandlordToken(request);
    const landlordFrontData = await returnLandlordObject(
      routeProtectionResponse.landlordAccount
    );
    if (routeProtectionResponse.isValid) {
      return refreshLandlordToken(
        landlordFrontData,
        null,
        routeProtectionResponse.newAccessToken
          ? routeProtectionResponse.newAccessToken
          : null
      );
    } else {
      return routeProtectionResponse.response;
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" });
  }
}
