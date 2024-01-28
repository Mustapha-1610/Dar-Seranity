import { NextResponse } from "next/server";

export async function POST() {
  try {
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
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
