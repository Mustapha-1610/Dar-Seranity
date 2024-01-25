import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessLandlordToken")?.value || "";
    const refreshToken =
      request.cookies.get("refreshLandlordToken")?.value || "";
    if (!accessToken || !refreshToken) {
      return NextResponse.json({
        success: false,
        error: "No Account Is Currently Logged In",
      });
    } else {
      const response = NextResponse.json({
        success: true,
      });
      response.cookies.set("accessLandlordToken", "", {
        expires: new Date(0),
      });
      response.cookies.set("refreshLandlordToken", "", {
        expires: new Date(0),
      });
      return response;
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
