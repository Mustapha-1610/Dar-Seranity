import { NextResponse, NextRequest } from "next/server";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { refreshLandlordToken } from "@/Helpers/RouteProtection/refreshLandlordToken";
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyLandlordToken(request);

    if (routeProtectionResponse.isValid) {
      const landlordData = {
        name: routeProtectionResponse.landlordAccount.name,
        surname: routeProtectionResponse.landlordAccount.surname,
        email: routeProtectionResponse.landlordAccount.email,
        createdListings:
          routeProtectionResponse.landlordAccount.createdPropertyListings,
        listingsCount:
          routeProtectionResponse.landlordAccount.propertyListingsCount,
      };
      return refreshLandlordToken(
        landlordData,
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
