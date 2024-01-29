import { NextResponse } from "next/server";

export const refreshAccessToken = (responseData: any, newAccessToken: any) => {
  const response = NextResponse.json({
    success: true,
    responseData,
  });
  response.cookies.set("accessRenterToken", newAccessToken!, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return response;
};
