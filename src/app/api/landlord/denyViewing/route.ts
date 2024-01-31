import { connect } from "@/DataBase/dbConfig";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const res = await verifyLandlordToken(request);
    if (res.isValid) {
      const reqBody = await request.json();
      const { renterId, propertyId } = reqBody;
      const renterAccount = await renter.findById(renterId);
      const propertyListing = await rentalPropertyListing.findById(propertyId);
      propertyListing.ViewingRequests = propertyListing.ViewingRequests.filter(
        (item: any) => item.renterId.toString() !== renterId.toString()
      );
      renterAccount.ViewingRequests = renterAccount.ViewingRequests.filter(
        (item: any) => item.propertyId.toString() !== propertyId.toString()
      );
      renterAccount.notifications.push({
        notificationsMessage:
          "Viewing Request Denied For : " + propertyListing.title,
        notificationContext: "viewingNotification",
        sentAt: new Date(),
        notificationImage: res.landlordAccount.profilePicture,
      });
      await renterAccount.save();
      await propertyListing.save();
      return NextResponse.json({ propertyListing });
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
