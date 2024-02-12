import { connect } from "@/DataBase/dbConfig";
import { sendLandlordPaymentReminderMail } from "@/Helpers/NodeMailer/landlord/landlordMailConfigs";
import { sendRentPaymentDueMails } from "@/Helpers/NodeMailer/renter/renterMailConfigs";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import landlord from "@/Modals/UsersModals/landlord";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";
connect;
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { paymentDate, propertyTitle, landlordId, renterId } = reqBody;
    console.log(reqBody, "WORKING");
    const renterData = await renter.findById(renterId);
    const landlordData = await landlord.findById(landlordId);
    landlordData.notifications.push({
      notificationsMessage:
        "Rent Is Due In 3 Days For Property : " + propertyTitle,
      notificationContext: {
        context: "rentDue",
      },
      recievedAt: new Date(),
      notificationImage: renterData.profilePicture,
    });
    renterData.notifications.push({
      notificationsMessage:
        "Rent Is Due In 3 Days For Property : " + propertyTitle,
      notificationContext: "rentDue",
      sentAt: new Date(),
      notificationImage: landlordData.profilePicture,
    });
    await renterData.save();
    await landlordData.save();
    await sendRentPaymentDueMails(
      renterData.name,
      renterData.email,
      propertyTitle,
      paymentDate
    );
    await sendLandlordPaymentReminderMail(
      landlordData.name,
      landlordData.email,
      propertyTitle,
      paymentDate
    );
    const socketData = {
      renterSocketId: renterData.socketId,
      landlordSocketId: renterData.socketId,
    };
    return NextResponse.json({ success: true, socketData });
  } catch (err) {
    return errorHandler(err);
  }
}
