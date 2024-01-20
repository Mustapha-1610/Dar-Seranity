import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import renter from "@/Modals/UsersModals/renter";
import { JwtPayload } from "jsonwebtoken";
import { connect } from "@/DataBase/dbConfig";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const { mailToken } = reqbody;
    const decodedMailToken = jwt.verify(
      mailToken,
      process.env.NODEMAILER_TOKEN_SECRET!
    ) as JwtPayload;
    if (decodedMailToken) {
      const verifiedRenter = await renter.findOne({
        email: decodedMailToken.email!,
      });
      if (verifiedRenter) {
        if (verifiedRenter.verificationStatus) {
          return NextResponse.json({
            error: "This Account Is Already Verified You Can Use It To Login !",
          });
        } else {
          verifiedRenter.verificationStatus = true;
          await verifiedRenter.save();
          return NextResponse.json({
            success: "Mail Verified You Can Now Login",
          });
        }
      } else {
        return NextResponse.json({
          error: "Account Deleted Or Non Existant !",
        });
      }
    } else {
      return NextResponse.json({ mailError: "Verification Mail Expired !" });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      mailError: "Verification Mail Expired !",
    });
  }
}
