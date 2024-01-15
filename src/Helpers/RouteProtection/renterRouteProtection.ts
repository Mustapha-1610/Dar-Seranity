import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import renter from "@/Modals/UsersModals/renter";
import { JwtPayload } from "jsonwebtoken";

export const verifyRenterToken = async (request: NextRequest) => {
  try {
    const accessToken = request.cookies.get("accessRenterToken")?.value || "";
    if (accessToken) {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
      const renterAccount = await renter.findById(decodedAccessToken.renter_id);
      return { isValid: true, renterAccount };
    }
  } catch (err) {
    try {
      const refreshToken =
        request.cookies.get("refreshRenterToken")?.value || "";
      if (refreshToken) {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!
        ) as JwtPayload;
        const renterAccount = await renter.findById(
          decodedRefreshToken.renter_id
        );
        if (renterAccount && renterAccount.refreshToken === refreshToken) {
          const newAccessToken = jwt.sign(
            { renter_id: renterAccount._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "5m" }
          );
          return { isValid: true, newAccessToken, renterAccount };
        }
      }
    } catch (refreshErr) {
      return { isValid: false, reason: "Login required" };
    }
  }
  return { isValid: false, reason: "Login required" };
};
