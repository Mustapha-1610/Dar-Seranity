import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import renter from "@/Modals/UsersModals/renter";
import { JwtPayload } from "jsonwebtoken";
import { connect } from "@/DataBase/dbConfig";
connect();
export const verifyRenterToken = async (request: NextRequest) => {
  try {
    const accessToken = request.cookies.get("accessRenterToken")?.value || "";
    if (accessToken) {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
      const renterAccount = await renter.findById(decodedAccessToken.renter_id);
      const refreshToken =
        request.cookies.get("refreshRenterToken")?.value || "";
      if (renterAccount && renterAccount.refreshToken === refreshToken) {
        const newAccessToken = jwt.sign(
          { renter_id: renterAccount._id },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: "5m" }
        );
        return { isValid: true, newAccessToken, renterAccount };
      } else {
        return denyAccess(request, "error Stage 1");
      }
    } else {
      return denyAccess(request, "error Stage 2");
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
        } else {
          return denyAccess(request, "error Stage 3");
        }
      } else {
        return denyAccess(request, "error Stage 4");
      }
    } catch (refreshErr) {
      return denyAccess(request, "error Stage 5");
    }
  }
};
const denyAccess = (request: NextRequest, errorStage: string) => {
  const response = NextResponse.json({
    reason: "Login required",
    request: request,
    stage: errorStage,
  });
  response.cookies.set("refreshRenterToken", "", {
    expires: new Date(0),
  });
  return { isValid: false, response };
};
