import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import landlord from "@/Modals/UsersModals/landlord";
import { JwtPayload } from "jsonwebtoken";
import { connect } from "@/DataBase/dbConfig";
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
      return { isValid: true, landlordAccount };
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
        }
      } else {
        return { isValid: false, reason: "Login required" };
      }
    } catch (refreshErr) {
      return { isValid: false, reason: "Login required" };
    }
  }
  return { isValid: false, reason: "Login required" };
};
