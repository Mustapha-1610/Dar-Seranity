import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import renter from "@/Modals/UsersModals/renter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import landlord from "@/Modals/UsersModals/landlord";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    if (!email || !password) {
      return NextResponse.json({ error: "Missing Inputs" });
    }
    let existingUser = await renter.findOne({ email: email.toUpperCase() });
    if (!existingUser || !bcrypt.compareSync(password, existingUser.password)) {
      existingUser = await landlord.findOne({ email: email.toUpperCase() });
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
            email: existingUser.email.toLowerCase(),
          };
          const response = NextResponse.json({ success: true, landlordData });
          const accessToken = jwt.sign(
            { landlord_id: existingUser._id },
            process.env.ACCESS_TOKEN_SECRET!,
            {
              expiresIn: "10m",
            }
          );
          const refreshToken = jwt.sign(
            { landlord_id: existingUser._id },
            process.env.REFRESH_TOKEN_SECRET!,
            {
              expiresIn: "1y",
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
        renterMailError:
          "You need to verify your mail first before logging in !",
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
      const response = NextResponse.json({ success: true, renterData });
      const accessToken = jwt.sign(
        { renter_id: existingUser._id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "10m",
        }
      );
      const refreshToken = jwt.sign(
        { renter_id: existingUser._id },
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "1y",
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
    return errorHandler(err);
  }
}
