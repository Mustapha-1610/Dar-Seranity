import { connect } from "@/DataBase/dbConfig";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const res: any = await verifyLandlordToken(request);
    if (res.isValid) {
      const landlordAccount = res.landlordAccount;
      const reqBody = await request.json();
      const { renterId, propertyId, viewingDate, familyCount } = reqBody;
      console.log(reqBody);
      const renterAccount = await renter.findById(renterId);
      const propertyListing = await rentalPropertyListing.findById(propertyId);
      propertyListing.ViewingRequests = propertyListing.ViewingRequests.filter(
        (item: any) => item.renterId.toString() !== renterId.toString()
      );
      renterAccount.ViewingRequests = renterAccount.ViewingRequests.filter(
        (item: any) => item.propertyId.toString() !== propertyId.toString()
      );
      propertyListing.scheduledViewings.push({
        renterName: renterAccount.name + " " + renterAccount.surname,
        renterId: renterAccount._id,
        picture: renterAccount.profilePicture,
        familyCount,
        viewingDate,
      });
      renterAccount.viewingSchedules.push({
        propertyId,
        propertyTitle: propertyListing.title,
        scheduledFor: viewingDate,
      });
      renterAccount.notifications.push({
        notificationsMessage:
          "Viewing Request Accepted For : " + propertyListing.title,
        notificationContext: "viewingNotification",
        sentAt: new Date(),
        notificationImage: landlordAccount.profilePicture,
      });
      await renterAccount.save();
      await propertyListing.save();
      const renterSocketData = {
        renterSocketId: renterAccount.socketId,
      };
      return NextResponse.json({ propertyListing, renterSocketData });
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
