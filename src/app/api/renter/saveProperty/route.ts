import { connect } from "@/DataBase/dbConfig";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyRenterToken(request);
    if (routeProtectionResponse.isValid) {
      const reqBody = await request.json();
      const { propertyId, propertyTitle, propertyDescription } = reqBody;
      routeProtectionResponse.renterAccount.savedRentalProperties.push({
        propertyId,
        propertyTitle,
        propertyDescription,
      });
      await routeProtectionResponse.renterAccount.save();
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
    return errorHandler(request);
  }
}
