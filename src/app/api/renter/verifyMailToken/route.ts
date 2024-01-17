import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import renter from "@/Modals/UsersModals/renter";
import { JwtPayload } from "jsonwebtoken";
export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const { mailToken } = reqbody;
    const decodedMailToken = jwt.verify(
      mailToken,
      process.env.NODEMAILER_TOKEN_SECRET!
    ) as JwtPayload;
    if (decodedMailToken) {
      const unverifiedRenter = await renter.findOneAndUpdate(
        { email: decodedMailToken.email! },
        {
          verificationStatus: true,
        },
        {
          new: true,
        }
      );
      if (unverifiedRenter) {
        return NextResponse.json({
          success: "Mail Verified You Can Now Login !",
        });
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
      error: "Verification Mail Expired ! Send New One",
    });
  }
}
