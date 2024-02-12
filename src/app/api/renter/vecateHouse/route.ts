import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import landlord from "@/Modals/UsersModals/landlord";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const res: any = await verifyRenterToken(request);
    if (res.isValid) {
      const reqBody = await request.json();
      const { propertyId, vacationDate } = reqBody;
      const propertyInformations = await rentalPropertyListing.findById(
        propertyId
      );
      const arrayIndex = res.renterAccount.rentedProperties.findIndex(
        (element: any) => String(element.propertyId) === String(propertyId)
      );
      let scheduledJobId = "";
      if (arrayIndex !== -1) {
        res.renterAccount.rentedProperties[arrayIndex].vacating = true;
        res.renterAccount.rentedProperties[arrayIndex].vacatingOn =
          vacationDate;
        scheduledJobId =
          res.renterAccount.rentedProperties[arrayIndex].scheduledReminderJobId;
      }
      propertyInformations.rented.isRented = false;
      propertyInformations.rented.isOnhold = true;
      propertyInformations.rented.vacationDate = vacationDate;
      propertyInformations.rented.nextPaymentDate = "";
      const landlordData = await landlord.findById({
        _id: propertyInformations.landlordInformations.id,
      });
      const landlordSocketData = landlordData.socketId;
      landlordData.notifications.push({
        notificationsMessage:
          "Vacate Notice For ''" +
          propertyInformations.title +
          "'' Property On " +
          vacationDate,
        notificationContext: {
          context: "moneyRecieved",
          contextId: propertyInformations._id,
        },
        recievedAt: new Date(),
        notificationImage: res.renterAccount.profilePicture,
      });
      const socketData = {
        landlordSocketData,
        scheduledJobId,
      };
      await landlordData.save();
      await res.renterAccount.save();
      await propertyInformations.save();
      const renterFrontData = returnRenterObject(res.renterAccount);
      return refreshAccessToken(
        renterFrontData,
        socketData,
        res.newAccessToken
      );
    } else {
      return res.reponse;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
