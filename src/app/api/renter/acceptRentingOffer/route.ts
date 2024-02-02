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
      propertyInformations.rented = {
        isRented: true,
        renterProfilePictue: res.renterAccount.profilePicture,
        rentedOn: new Date(),
        earned: propertyInformations.price * 2,
        isOnhold: false,
      };

      res.renterAccount.rentedProperties.push({
        propertyId,
        propertyTitle: propertyInformations.title,
        rentedOn: new Date(),
        price: propertyInformations.price,
      });
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
          " Property By" +
          res.renterAccount.name,
        notificationContext: {
          context: "acceptedRentalOffer",
          contextId: propertyInformations._id,
        },
        recievedAt: new Date(),
        notificationImage: res.renterAccount.profilePicture,
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
