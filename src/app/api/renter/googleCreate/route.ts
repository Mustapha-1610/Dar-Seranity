import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import renter from "@/Modals/UsersModals/renter";
import landlord from "@/Modals/UsersModals/landlord";
import { connect } from "@/DataBase/dbConfig";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { credentialsToken } = reqBody;
    if (!credentialsToken) {
      return NextResponse.json({ error: "Error ! Try Again Later " });
    }
    const renterToken = jwt.decode(credentialsToken) as JwtPayload;
    let existingRenter = await renter.findOne({
      email: renterToken.email.toUpperCase(),
    });
    if (existingRenter) {
      return NextResponse.json({ error: "Account Exists Allready !" });
    } else {
      existingRenter = await landlord.findOne({
        email: renterToken.email.toUpperCase(),
      });
      if (existingRenter) {
        return NextResponse.json({ error: "Account Exists Allready !" });
      } else {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let socketId = "";
        for (let i = 0; i < 25; i++) {
          socketId += characters[Math.floor(Math.random() * characters.length)];
        }
        const newRenter = await renter.create({
          name: renterToken.given_name,
          surname: renterToken.family_name,
          email: renterToken.email.toUpperCase(),
          gmailAccount: true,
          verificationStatus: true,
          socketId,
        });
        const renterData = returnRenterObject(newRenter);
        const response = NextResponse.json({
          success: "Account Created !",
          renterData,
        });
        const accessToken = jwt.sign(
          { renter_id: newRenter._id },
          process.env.ACCESS_TOKEN_SECRET!,
          {
            expiresIn: "10m",
          }
        );
        const refreshToken = jwt.sign(
          { renter_id: newRenter._id },
          process.env.REFRESH_TOKEN_SECRET!,
          {
            expiresIn: "1y",
          }
        );
        newRenter.refreshToken = refreshToken;
        await newRenter.save();
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
    }
  } catch (err) {
    return errorHandler(err);
  }
}
