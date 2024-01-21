import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import renter from "@/Modals/UsersModals/renter";
import landlord from "@/Modals/UsersModals/landlord";
import { connect } from "@/DataBase/dbConfig";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { credentialsToken } = reqBody;
    if (!credentialsToken) {
      return NextResponse.json({ error: "Error ! Try Again Later " });
    }
    const userToken = jwt.decode(credentialsToken) as JwtPayload;
    let existingUser = await renter.findOne({
      email: userToken.email.toUpperCase(),
    });
    if (existingUser) {
      if (!existingUser.gmailAccount) {
        return NextResponse.json({
          error: "Account Exists But Is Not A Gmail Account !",
        });
      } else {
        const renterData = {
          name: existingUser.name,
          surname: existingUser.surname,
          email: existingUser.email.toLowerCase(),
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
    } else {
      existingUser = await landlord.findOne({
        email: userToken.email.toUpperCase(),
      });
      if (existingUser) {
        if (!existingUser.gmailAccount) {
          return NextResponse.json({
            error: "Account Exists But Is Not A Gmail Account !",
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
      } else {
        return NextResponse.json({ error: "Account Non Existant ! Signup" });
      }
    }
  } catch (err) {
    return errorHandler(err);
  }
}
