import { sendContactMeMail } from "@/Helpers/NodeMailer/renter/renterMailConfigs";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, message } = reqBody;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing Inputs !" });
    } else {
      await sendContactMeMail(email, name, message);
      return NextResponse.json({ success: "Email Submitted !" });
    }
  } catch (err) {
    return errorHandler(err);
  }
}
