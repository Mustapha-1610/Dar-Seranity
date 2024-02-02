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
    propertyInformations.possibleRenters =
      propertyInformations.possibleRenters.filter(
        (property: any) => String(property.renterId) !== String(renterId)
      );

    renterAccount.notifications.push({
      notificationsMessage:
        "Declined Renting For " + propertyInformations.title + " property",
      notificationContext: "RentalOffer",
      sentAt: new Date(),
      notificationImage: propertyInformations.propertyImages[0],
    });
    await propertyInformations.save();
    await renterAccount.save();
    const renterSocketData = renterAccount.socketId;
    return NextResponse.json({
      renterSocketData,
      propertyInformations,
      success: true,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
