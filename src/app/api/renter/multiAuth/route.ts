import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import renter from "@/Modals/UsersModals/renter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import landlord from "@/Modals/UsersModals/landlord";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    let existingUser = await renter.findOne({ email });
    if (!existingUser || !bcrypt.compareSync(password, existingUser.password)) {
      existingUser = await landlord.findOne({ email });
      if (!existingUser) {
        return NextResponse.json({ error: "Wrong mail or password" });
      } else {
        if (!existingUser.verificationStatus) {
          return NextResponse.json({
            landlordMailError: "Account Application Still Awaiting Team Review",
          });
        } else if (!existingUser.activationStatus) {
          return NextResponse.json({
            error:
              "Account Disabled, Contact Administration For Further Informations",
          });
        } else {
          const landlordData = {
            name: existingUser.name,
            surname: existingUser.surname,
            email: existingUser.email,
          };
          const response = NextResponse.json({ landlordData });
          const accessToken = jwt.sign(
            { landlord_id: existingUser._id },
            process.env.ACCESS_TOKEN_SECRET!,
            {
              expiresIn: "5m",
            }
          );
          const refreshToken = jwt.sign(
            { landlord_id: existingUser._id },
            process.env.REFRESH_TOKEN_SECRET!,
            {
              expiresIn: "30d",
            }
          );
          existingUser.refreshToken = refreshToken;
          await existingUser.save();
          response.cookies.set("accessLandlordToken", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });
          response.cookies.set("refreshLandlordToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });
          return response;
        }
      }
    }
    if (!existingUser.verificationStatus) {
      return NextResponse.json({
        mailError: "You need to verify your mail first before logging in !",
        name: existingUser.name,
        email: existingUser.email,
        _id: existingUser._id,
        activationcode: existingUser.activationCode,
      });
    } else if (!existingUser.activationStatus) {
      return NextResponse.json({
        error:
          "Account Disabled, Contact Administration For Further Informations",
      });
    } else {
      const renterData = {
        name: existingUser.name,
        surname: existingUser.surname,
        email: existingUser.email,
      };
      const response = NextResponse.json({ success: "welcome", renterData });
      const accessToken = jwt.sign(
        { renter_id: existingUser._id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "5s",
        }
      );
      const refreshToken = jwt.sign(
        { renter_id: existingUser._id },
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "5s",
        }
      );
      existingUser.refreshToken = refreshToken;
      await existingUser.save();
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
