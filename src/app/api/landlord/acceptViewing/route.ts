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
      landlordAccount.scheduledViewings.push({
        renterId,
        scheduledFor: viewingDate,
        propertyTitle: propertyListing.title,
        propertyId: propertyListing._id,
        renterName: renterAccount.name + " " + renterAccount.surname,
      });
      await renterAccount.save();
      await propertyListing.save();
      const renterSocketData = {
        renterSocketId: renterAccount.socketId,
      };
      const extraData = {
        renterData: {
          renterId: renterAccount._id,
        },
        propertyData: {
          propertyTitle: propertyListing.title,
          propertyId: propertyListing._id,
          viewingDate,
        },
        landlordData: {
          landlordId: landlordAccount._id,
        },
        socketData: {
          renterSocketData: renterAccount.socketId,
          landlordSocketData: landlordAccount.socketId,
        },
      };
      return NextResponse.json({
        propertyListing,
        renterSocketData,
        extraData,
      });
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
