import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import renter from "@/Modals/UsersModals/renter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const existingRenter = await renter.findOne({ email });
    if (
      !existingRenter ||
      !bcrypt.compareSync(password, existingRenter.password)
    ) {
      return NextResponse.json({ error: "Wrong mail or password" });
    }
    if (!existingRenter.verificationStatus) {
      return NextResponse.json({
        mailError: "You need to verify your mail first before logging in !",
        name: existingRenter.name,
        email: existingRenter.email,
        _id: existingRenter._id,
        activationcode: existingRenter.activationCode,
      });
    } else if (!existingRenter.activationStatus) {
      return NextResponse.json({
        error:
          "Account Disabled, Contant Administration For Further Informations",
      });
    } else {
      const renterData = {
        name: existingRenter.name,
        surname: existingRenter.surname,
        email: existingRenter.email,
      };
      const response = NextResponse.json({ renterData });
      const accessToken = jwt.sign(
        { renter_id: existingRenter._id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "5m",
        }
      );
      const refreshToken = jwt.sign(
        { renter_id: existingRenter._id },
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "30d",
        }
      );
      existingRenter.refreshToken = refreshToken;
      await existingRenter.save();
      response.cookies.set("accessRenterToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      response.cookies.set("refreshRenterToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return response;
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ serverError: "Server Error" });
  }
}
