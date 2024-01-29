"use server";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/DataBase/dbConfig";
import { renterConfirmationMail } from "@/Helpers/NodeMailer/renter/renterMailConfigs";
import landlord from "@/Modals/UsersModals/landlord";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, surname, email, password } = reqBody;
    if (!name && !surname && !email && !password) {
      return NextResponse.json({ error: "Missing Inputs !" });
    }
    let newRenter = await landlord.findOne({ email: email.toUpperCase() });
    if (newRenter) {
      return NextResponse.json({ error: "Account Already Exists !" });
    } else {
      newRenter = await renter.findOne({ email: email.toUpperCase() });
      if (!newRenter) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let activationCode = "";
        let socketId = "";
        for (let i = 0; i < 25; i++) {
          activationCode +=
            characters[Math.floor(Math.random() * characters.length)];
          socketId += characters[Math.floor(Math.random() * characters.length)];
        }
        newRenter = await renter.create({
          name,
          surname,
          email: email.toUpperCase(),
          password: bcrypt.hashSync(password),
          activationCode,
          socketId,
        });

        await renterConfirmationMail(name, email, activationCode);
        return NextResponse.json({
          success: "Account Created ! Verification Mail Sent",
        });
      } else {
        return NextResponse.json({ error: "Account Already Exists !" });
      }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ serverError: "Server Error" });
  }
}
