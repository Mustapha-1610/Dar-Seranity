import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import renter from "@/Modals/UsersModals/renter";
import { JwtPayload } from "jsonwebtoken";
import { connect } from "@/DataBase/dbConfig";
import landlord from "@/Modals/UsersModals/landlord";
connect();
export const verifyLandlordToken = async (request: NextRequest) => {
  try {
    const accessToken = request.cookies.get("accessLandlordToken")?.value || "";
    if (accessToken) {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
      const landlordAccount = await landlord.findById(
        decodedAccessToken.landlord_id
      );
      const refreshToken =
        request.cookies.get("refreshLandlordToken")?.value || "";
      if (landlordAccount && landlordAccount.refreshToken === refreshToken) {
        const newAccessToken = jwt.sign(
          { landlord_id: landlordAccount._id },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: "10m" }
        );
        return { isValid: true, newAccessToken, landlordAccount };
      } else {
        return denyAccess(request, "error Stage 1");
      }
    } else {
      return denyAccess(request, "error Stage 2");
    }
  } catch (err) {
    try {
      const refreshToken =
        request.cookies.get("refreshLandlordToken")?.value || "";
      if (refreshToken) {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!
        ) as JwtPayload;
        const landlordAccount = await landlord.findById(
          decodedRefreshToken.landlord_id
        );
        if (landlordAccount && landlordAccount.refreshToken === refreshToken) {
          const newAccessToken = jwt.sign(
            { landlord_id: landlordAccount._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "5m" }
          );
          return { isValid: true, newAccessToken, landlordAccount };
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
