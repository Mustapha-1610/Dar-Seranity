import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnLandlordObject } from "@/Helpers/backFunctions/returnLandlordObject";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import landlord from "@/Modals/UsersModals/landlord";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const res: any = await verifyRenterToken(request);
    if (res.isValid) {
      const reqBody = await request.json();

      const { propertyId } = reqBody;
      const propertyInformations = await rentalPropertyListing.findById(
        propertyId
      );
      const index = propertyInformations.possibleRenters.findIndex(
        (renter: any) =>
          String(renter.renterId) === String(res.renterAccount._id)
      );
      if (index !== -1) {
        propertyInformations.possibleRenters[index].responseStatus = "Declined";
      }
      res.renterAccount.viewingSchedules =
        res.renterAccount.viewingSchedules.filter(
          (property: any) => property.propertyId !== propertyInformations._id
        );
      await propertyInformations.save();
      await res.renterAccount.save();
      const landlordData = await landlord.findById({
        _id: propertyInformations.landlordInformations.id,
      });
      const landlordSocketData = landlordData.socketId;
      landlordData.notifications.push({
        notificationsMessage:
          "Rental Offer Declined For : " +
          propertyInformations.title +
          " Property By " +
          res.renterAccount.name,
        notificationContext: {
          context: "declinedRentingOffer",
          contextId: propertyInformations._id,
        },
        recievedAt: new Date(),
        notificationImage: res.renterAccount.profilePicture,
      });
      await landlordData.save();
      const renterFrontData = await returnLandlordObject(res.renterAccount);
      return refreshAccessToken(
        renterFrontData,
        landlordSocketData,
        res.newAccessToken
      );
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
