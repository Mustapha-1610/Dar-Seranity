import { NextResponse } from "next/server";

export const refreshLandlordToken = (
  responseData: any,
  newAccessToken: any
) => {
  const response = NextResponse.json({
    success: true,
    responseData,
  });
  if (newAccessToken) {
    const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000);
    response.cookies.set("accessLandlordToken", newAccessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      expires: accessTokenExpiration,
    });
  }

  return response;
};
