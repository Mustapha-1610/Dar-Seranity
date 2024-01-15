"use server";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/DataBase/dbConfig";
import { renterConfirmationMail } from "@/Helpers/NodeMailer/renterMailConfigs";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, surname, email, password, profilePicture } = reqBody;
    if (!name && !surname && !email && !password) {
      return NextResponse.json({ error: "Missing Inputs !" });
    }
    let newRenter = await renter.findOne({ email });
    if (!newRenter) {
      const securePassword = bcrypt.hashSync(password);
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let activationCode = "";
      for (let i = 0; i < 25; i++) {
        activationCode +=
          characters[Math.floor(Math.random() * characters.length)];
      }

      !profilePicture
        ? (newRenter = await renter.create({
            name,
            surname,
            email,
            password: securePassword,
            activationCode,
          }))
        : (newRenter = await renter.create({
            name,
            surname,
            email,
            password: securePassword,
            activationCode,
            profilePicture,
          }));
      await renterConfirmationMail(name, email, newRenter._id, activationCode);
    } else {
      return NextResponse.json({ error: "Account Allready Exists" });
    }
    return NextResponse.json({ success: "Created" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ serverError: "Server Error" });
  }
}
