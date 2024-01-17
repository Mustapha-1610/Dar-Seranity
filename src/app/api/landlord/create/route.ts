"use server";
import landlord from "@/Modals/UsersModals/landlord";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/DataBase/dbConfig";
import { landlordConfirmationMail } from "@/Helpers/NodeMailer/landlordMailConfigs";
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
      profilePicture,
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
    let newLandlord = await renter.findOne({ email });
    if (newLandlord) {
      return NextResponse.json({ error: "Account Allready Exists" });
    } else {
      newLandlord = await landlord.findOne({ email });
      if (!newLandlord) {
        const securePassword = bcrypt.hashSync(password);
        !profilePicture
          ? (newLandlord = await landlord.create({
              name,
              surname,
              email,
              password: securePassword,
              idCardBackSideImage,
              idCardFrontSideImage,
            }))
          : (newLandlord = await landlord.create({
              name,
              surname,
              email,
              password: securePassword,
              profilePicture,
              idCardBackSideImage,
              idCardFrontSideImage,
            }));
        await landlordConfirmationMail(name, email);
        return NextResponse.json({
          success: "Account Application Submitted !",
        });
      } else {
        return NextResponse.json({ error: "Account Allready Exists" });
      }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ serverError: "Server Error" });
  }
}
