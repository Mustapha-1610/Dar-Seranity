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
      if (propertyInformations.ViewingRequests.length > 0) {
        propertyInformations.ViewingRequests.map(async (item: any) => {
          const renterAccount = await renter.findById(item.renterId);
          console.log(renterAccount);
          renterAccount.ViewingRequests = renterAccount.ViewingRequests.filter(
            (property: any) => {
              property.propertyId.toString() !==
                propertyInformations._id.toString();
            }
          );
          await renterAccount.save();
        });
      }

      if (propertyInformations.scheduledViewings.length > 0) {
        propertyInformations.scheduledViewings.map(async (item: any) => {
          const renterAccount = await renter.findById(item.renterId);
          renterAccount.viewingSchedules =
            renterAccount.viewingSchedules.filter((property: any) => {
              property.propertyId.toString() !== propertyId.toString();
            });
          if (renterAccount._id !== res.renterAccount._id) {
            renterAccount.notifications.push({
              notificationsMessage:
                "Scheduled Viewing For Property : " +
                propertyInformations.title +
                " Has Been Canceld !",
              notificationContext: "RentalOffer",
              sentAt: new Date(),
              notificationImage: propertyInformations.propertyImages[0],
            });
          }
          await renterAccount.save();
        });
      }
      if (propertyInformations.possibleRenters.length > 0) {
        propertyInformations.possibleRenters.map(async (item: any) => {
          if (item.renterId.toString() !== res.renterAccount._id.toString()) {
            if (item.responseStatus === "Awaiting Response") {
              const renterAccount = await renter.findById(item.renterId);
              renterAccount.rentalOffers = renterAccount.rentalOffers.filter(
                (property: any) => {
                  String(property.propertyId) !==
                    String(propertyInformations._id);
                }
              );
              renterAccount.notifications.push({
                notificationsMessage:
                  "Rental Offer For " +
                  propertyInformations.title +
                  " property Expired Or Someone Else Rented The House",
                notificationContext: "RentalOffer",
                sentAt: new Date(),
                notificationImage: propertyInformations.propertyImages[0],
              });
              await renterAccount.save();
            }
          }
        });
      }
      propertyInformations.possibleRenters = [];
      propertyInformations.ViewingRequests = [];
      propertyInformations.scheduledViewings = [];
      let newDate = new Date();
      let oneMonthLater = new Date(newDate);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      res.renterAccount.rentedProperties.push({
        propertyId,
        propertyTitle: propertyInformations.title,
        rentedOn: new Date(),
        price: propertyInformations.price,

        nextPaymentDate: oneMonthLater,
      });
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
        res.renterAccount.totalRentPaid.total += 1;
      res.renterAccount.totalRentPaid.lastPaymentDate = new Date();
      res.renterAccount.rentalOffers = res.renterAccount.rentalOffers.filter(
        (property: any) =>
          String(property.propertyId) !== String(propertyInformations._id)
      );
      await res.renterAccount.save();
      await propertyInformations.save();
      const landlordData = await landlord.findById({
        _id: propertyInformations.landlordInformations.id,
      });
      const landlordSocketData = landlordData.socketId;
      landlordData.notifications.push({
        notificationsMessage:
          "Rental Offer Accepted For : " +
          propertyInformations.title +
          " Property By " +
          res.renterAccount.name,
        notificationContext: {
          context: "acceptedRentalOffer",
          contextId: propertyInformations._id,
        },
        recievedAt: new Date(),
        notificationImage: res.renterAccount.profilePicture,
      });
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
      landlordData.earnings += finalAmount;
      propertyInformations.rented = {
        isRented: true,
        renterProfilePictue: res.renterAccount.profilePicture,
        rentedOn: newDate,
        nextPaymentDate: oneMonthLater,
        earned: finalAmount,
        isOnhold: false,
      };
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

      const renterFrontData = await returnRenterObject(res.renterAccount);
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
