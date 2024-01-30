import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest } from "next/server";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
import landlord from "@/Modals/UsersModals/landlord";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyRenterToken(request);
    if (routeProtectionResponse.isValid) {
      const reqBody = await request.json();
      const { adults, children, infants, propertyId, viewingDate } = reqBody;
      const propetyInfos = await rentalPropertyListing.findByIdAndUpdate(
        propertyId,
        {
          $push: {
            scheduledListings: {
              renterName: routeProtectionResponse.renterAccount.name,
              picture: routeProtectionResponse.renterAccount.profilePicture,
              renterId: routeProtectionResponse.renterAccount._id,
              familyCount: {
                adults,
                children,
                infants,
              },

              suggestedViewingDate: viewingDate,
            },
          },
        }
      );
      routeProtectionResponse.renterAccount.viewingSchedules.push({
        propertyId: propetyInfos._id,
        propertyTitle: propetyInfos.title,
        submittedOn: new Date(),
        scheduledFor: viewingDate,
      });
      await routeProtectionResponse.renterAccount.save();
      const renterFrontData = returnRenterObject(
        routeProtectionResponse.renterAccount
      );
      const landlordData = await landlord.findById({
        _id: propetyInfos.landlordInformations.id,
      });
      landlordData.notifications.push({
        notificationsMessage:
          "New Viewing Scheduled for : " + propetyInfos.title,
        notificationContext: "scheduledViewings",
        recievedAt: new Date(),
        notificationImage: routeProtectionResponse.renterAccount.profilePicture,
      });
      const landlordSocketData = {
        landlordSocketId: landlordData.socketId,
        landlordMail: landlordData.email,
      };
      await landlordData.save();
      return refreshAccessToken(
        renterFrontData,
        landlordSocketData,
        routeProtectionResponse.newAccessToken
      );
    } else {
      return routeProtectionResponse.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
