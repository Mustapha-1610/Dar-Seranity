"use server";
import landlord from "@/Modals/UsersModals/landlord";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/DataBase/dbConfig";
import { landlordConfirmationMail } from "@/Helpers/NodeMailer/landlord/landlordMailConfigs";
import renter from "@/Modals/UsersModals/renter";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      name,
      surname,
      email,
      password,
      idCardFrontSideImage,
      idCardBackSideImage,
    } = reqBody;
    if (
      !name &&
      !surname &&
      !email &&
      !password &&
      !idCardBackSideImage &&
      !idCardFrontSideImage
    ) {
      return NextResponse.json({ error: "Missing Inputs !" });
    }
    let newLandlord = await renter.findOne({ email: email.toUpperCase() });
    if (newLandlord) {
      return NextResponse.json({ error: "Account Already Exists" });
    } else {
      newLandlord = await landlord.findOne({ email: email.toUpperCase() });
      if (!newLandlord) {
        const securePassword = bcrypt.hashSync(password);
        newLandlord = await landlord.create({
          name,
          surname,
          email: email.toUpperCase(),
          password: securePassword,
          idCardBackSideImage,
          idCardFrontSideImage,
        });
        await landlordConfirmationMail(name, email);
        return NextResponse.json({
          success:
            "Account Application Submitted! You'll receive an email notification once the review is complete",
        });
      } else {
        return NextResponse.json({ error: "Account Already Exists" });
      }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ serverError: "Server Error" });
  }
}
