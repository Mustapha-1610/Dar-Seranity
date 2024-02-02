import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { renterId, propertyId } = reqBody;
    const renterAccount = await renter.findById(renterId);
    const propertyInformations = await rentalPropertyListing.findById(
      propertyId
    );
    const index = propertyInformations.possibleRenters.findIndex(
      (renter: any) => String(renter.renterId) === String(renterAccount._id)
    );
    if (index !== -1) {
      propertyInformations.possibleRenters[index].responseStatus =
        "Awaiting Response";
    }
    renterAccount.rentalOffers.push({
      propertyId: propertyInformations._id,
      rentingPrice: propertyInformations.price,
      sentOn: new Date(),
      propertyTitle: propertyInformations.title,
    });
    renterAccount.notifications.push({
      notificationsMessage:
        "Rental Offer Recieved For " + propertyInformations.title + " property",
      notificationContext: "RentalOffer",
      sentAt: new Date(),
      notificationImage: propertyInformations.propertyImages[0],
    });
    await propertyInformations.save();
    await renterAccount.save();
    const renterSocketData = renterAccount.socketId;
    return NextResponse.json({
      propertyInformations,
      renterSocketData,
      success: true,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
