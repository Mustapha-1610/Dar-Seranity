import { NextResponse, NextRequest } from "next/server";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { refreshLandlordToken } from "@/Helpers/RouteProtection/refreshLandlordToken";
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyLandlordToken(request);

    if (routeProtectionResponse.isValid) {
      const frontLandlordData = {
        name: routeProtectionResponse.landlordAccount.name,
        surname: routeProtectionResponse.landlordAccount.surname,
        email: routeProtectionResponse.landlordAccount.email,
        propertyListingsCount:
          routeProtectionResponse.landlordAccount.propertyListingsCount,
        notifications: routeProtectionResponse.landlordAccount.notifications,
        createdPropertyListings:
          routeProtectionResponse.landlordAccount.createdPropertyListings,
        profilePicture: routeProtectionResponse.landlordAccount.profilePicture,
      };
      return refreshLandlordToken(
        frontLandlordData,
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
