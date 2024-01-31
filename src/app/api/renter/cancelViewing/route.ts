import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest } from "next/server";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
import landlord from "@/Modals/UsersModals/landlord";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyRenterToken(request);
    if (routeProtectionResponse.isValid) {
      const reqBody = await request.json();
      const { propertyId } = reqBody;
      const propetyInfos = await rentalPropertyListing.findById(propertyId);
      propetyInfos.ViewingRequests = propetyInfos.ViewingRequests.filter(
        (listing: any) =>
          listing.renterId.toString() !==
          routeProtectionResponse.renterAccount._id.toString()
      );
      routeProtectionResponse.renterAccount.ViewingRequests =
        routeProtectionResponse.renterAccount.ViewingRequests.filter(
          (listing: any) =>
            listing.propertyId.toString() !== propetyInfos._id.toString()
        );
      const landlordData = await landlord.findById({
        _id: propetyInfos.landlordInformations.id,
      });
      landlordData.notifications.push({
        notificationsMessage:
          "Viewing Request Canceld For : " + propetyInfos.title,
        notificationContext: {
          context: "scheduledViewing",
          contextId: propetyInfos._id,
        },
        recievedAt: new Date(),
        notificationImage: routeProtectionResponse.renterAccount.profilePicture,
      });
      await propetyInfos.save();
      await landlordData.save();

      await routeProtectionResponse.renterAccount.save();

      const renterFrontData = returnRenterObject(
        routeProtectionResponse.renterAccount
      );
      return refreshAccessToken(
        renterFrontData,
        null,
        routeProtectionResponse.newAccessToken
      );
    } else {
      return routeProtectionResponse.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
