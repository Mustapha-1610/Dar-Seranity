import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest } from "next/server";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyRenterToken(request);
    if (routeProtectionResponse.isValid) {
      const reqBody = await request.json();
      const { propertyId } = reqBody;
      const propetyInfos = await rentalPropertyListing.findById(propertyId);
      propetyInfos.scheduledListings = propetyInfos.scheduledListings.filter(
        (listing: any) =>
          listing.renterId !== routeProtectionResponse.renterAccount._id
      );
      routeProtectionResponse.renterAccount.viewingSchedules =
        routeProtectionResponse.renterAccount.viewingSchedules.filter(
          (listing: any) => listing.propertyId !== propetyInfos._id
        );
      await propetyInfos.save();
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
    return errorHandler(err);
  }
}
