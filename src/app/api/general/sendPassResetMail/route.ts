import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import renter from "@/Modals/UsersModals/renter";
import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import { sendPassResetMail } from "@/Helpers/NodeMailer/renter/renterMailConfigs";
import landlord from "@/Modals/UsersModals/landlord";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    if (!email) {
      return NextResponse.json({ error: "Please Enter Your Mail" });
    }
    let userAccount = await renter.findOne({
      email: email.toUpperCase(),
    });
    if (!userAccount) {
      userAccount = await landlord.findOne({ email: email.toUpperCase() });
      if (userAccount) {
        await sendPassResetMail(userAccount.name, userAccount.email);
        return NextResponse.json({ success: true, status: 201 });
      } else {
        return NextResponse.json({ success: true, status: 201 });
      }
    } else {
      if (userAccount.gmailAccount) {
        return NextResponse.json({
          error: "Gmail Accounts Are Only Accessible With Gmail Login !",
        });
      } else {
        await sendPassResetMail(userAccount.name, userAccount.email);
        return NextResponse.json({ success: true, status: 201 });
      }
    }
  } catch (err) {
    return errorHandler(err);
  }
}
