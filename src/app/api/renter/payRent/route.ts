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
      const { propertyId } = reqBody;
      const propertyInformations = await rentalPropertyListing.findById(
        propertyId
      );
      let newDate = new Date();
      let oneMonthLater = new Date(newDate);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      const arrayIndex = res.renterAccount.rentedProperties.findIndex(
        (element: any) => String(element.propertyId) === String(propertyId)
      );
      if (arrayIndex !== -1) {
        res.renterAccount.rentedProperties[arrayIndex].nextPaymentDate =
          oneMonthLater;
      }
      res.renterAccount.transactionHistory.push({
        transactionAmount: propertyInformations.price,
        transactionDate: new Date(),
        reciever: propertyInformations.landlordInformations.name,
        propety: {
          propertyTitle: propertyInformations.title,
          propertyId: propertyInformations._id,
        },
      });
      res.renterAccount.totalRentPaid.total =
        res.renterAccount.totalRentPaid.total += propertyInformations.price;
      res.renterAccount.totalRentPaid.lastPaymentDate = new Date();

      let finalAmount = 0;
      if (propertyInformations.transactionFees === 10) {
        finalAmount +=
          propertyInformations.price - propertyInformations.price * 0.045;
      } else if (propertyInformations.transactionFees === 20) {
        finalAmount +=
          propertyInformations.price - propertyInformations.price * 0.04;
      } else {
        finalAmount +=
          propertyInformations.price - propertyInformations.price * 0.5;
      }
      const landlordData = await landlord.findById({
        _id: propertyInformations.landlordInformations.id,
      });
      const landlordSocketData = landlordData.socketId;
      landlordData.notifications.push({
        notificationsMessage:
          finalAmount +
          "$ Recieved For ''" +
          propertyInformations.title +
          "'' Property By " +
          res.renterAccount.name,
        notificationContext: {
          context: "moneyRecieved",
          contextId: propertyInformations._id,
        },
        recievedAt: new Date(),
        notificationImage: res.renterAccount.profilePicture,
      });
      landlordData.earnings += finalAmount;

      propertyInformations.rented.nextPaymentDate = oneMonthLater;
      propertyInformations.rented.earned += finalAmount;

      landlordData.transactions.push({
        recievedAmount: finalAmount,
        recievedOn: new Date(),
        recievedFrom: res.renterAccount.name + " " + res.renterAccount.surname,
        propertyInformations: {
          propertyTitle: propertyInformations.title,
          propertyId: propertyInformations._id,
          transactionFee: propertyInformations.transactionFees,
        },
      });
      await landlordData.save();
      await res.renterAccount.save();
      await propertyInformations.save();
      const renterFrontData = returnRenterObject(res.renterAccount);
      return refreshAccessToken(
        renterFrontData,
        landlordSocketData,
        res.newAccessToken
      );
    } else {
      return res.reponse;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
