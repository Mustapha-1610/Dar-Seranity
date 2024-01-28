import { NextResponse, NextRequest } from "next/server";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { refreshLandlordToken } from "@/Helpers/RouteProtection/refreshLandlordToken";
import { returnLandlordObject } from "@/Helpers/backFunctions/returnLandlordObject";
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyLandlordToken(request);
    const landlordFrontData = await returnLandlordObject(
      routeProtectionResponse.landlordAccount
    );
    console.log(landlordFrontData);
    if (routeProtectionResponse.isValid) {
      return refreshLandlordToken(
        landlordFrontData,
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
