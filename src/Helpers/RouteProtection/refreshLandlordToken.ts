import { NextResponse } from "next/server";

export const refreshLandlordToken = (
  responseData: any,
  newAccessToken: any
) => {
  const response = NextResponse.json({
    success: "Valid",
    responseData,
  });
  if (newAccessToken) {
    response.cookies.set("accessLandlordToken", newAccessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }

  return response;
};
