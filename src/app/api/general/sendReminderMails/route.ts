import { sendLandlordReminderMail } from "@/Helpers/NodeMailer/landlord/landlordMailConfigs";
import { sendRenterReminderMail } from "@/Helpers/NodeMailer/renter/renterMailConfigs";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import landlord from "@/Modals/UsersModals/landlord";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { propertyTitle, viewingDate, renterId, landlordId } = reqBody;
    console.log(reqBody);

    const renterAccount = await renter.findById(renterId);
    const landlordAccount = await landlord.findById(landlordId);
    landlordAccount.notifications.push({
      notificationsMessage:
        "Upcoming Viewing Scheduled In 3 Days For  : " + propertyTitle,
      notificationContext: {
        context: "scheduledViewing",
      },
      recievedAt: new Date(),
      notificationImage: renterAccount.profilePicture,
    });
    renterAccount.notifications.push({
      notificationsMessage:
        "Upcoming Viewing Scheduled In 3 Days For  : " + propertyTitle,
      notificationContext: "viewingNotification",
      sentAt: new Date(),
      notificationImage: landlordAccount.profilePicture,
    });
    await sendLandlordReminderMail(
      landlordAccount.name,
      landlordAccount.email,
      propertyTitle,
      viewingDate
    );
    await sendRenterReminderMail(
      renterAccount.name,
      renterAccount.email,
      propertyTitle,
      viewingDate
    );
    await landlordAccount.save();
    await renterAccount.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorHandler(err);
  }
}
