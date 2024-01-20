import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import renter from "@/Modals/UsersModals/renter";
import { connect } from "@/DataBase/dbConfig";
import landlord from "@/Modals/UsersModals/landlord";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { mailToken, password, confirmPassword } = reqBody;
    if (!mailToken || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing Expected Inputs" });
    }
    const decodedMailToken = jwt.verify(
      mailToken,
      process.env.NODEMAILER_TOKEN_SECRET!
    ) as JwtPayload;
    if (decodedMailToken) {
      if (password === confirmPassword) {
        let userAccount = await renter.findOne({
          email: decodedMailToken.email.toUpperCase(),
        });
        if (userAccount) {
          const checkPassword = bcrypt.compareSync(
            password,
            userAccount.password
          );
          if (checkPassword) {
            return NextResponse.json({ error: "Cant Change To Old Password" });
          } else {
            userAccount.password = bcrypt.hashSync(password);
            await userAccount.save();
            return NextResponse.json({ success: true });
          }
        } else {
          userAccount = await landlord.findOne({
            email: decodedMailToken.email.toUpperCase(),
          });
          if (userAccount) {
            const checkPassword = bcrypt.compareSync(
              password,
              userAccount.password
            );
            if (checkPassword) {
              return NextResponse.json({
                error: "Cant Change To Old Password",
              });
            } else {
              userAccount.password = bcrypt.hashSync(password);
              await userAccount.save();
              return NextResponse.json({ success: true });
            }
          }
          return NextResponse.json({
            error: "Account Deleted Or Dosent Exist !",
          });
        }
      } else {
        return NextResponse.json({ error: "Password Mismatch" });
      }
    } else {
      return NextResponse.json({
        mailError: "Verification Mail Expired !",
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      mailError: "Verification Mail Expired !",
    });
  }
}
