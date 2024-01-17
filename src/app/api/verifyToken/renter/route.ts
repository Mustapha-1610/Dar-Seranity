import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const { token } = reqbody;
    const decodedRefreshToken = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    );
    if (decodedRefreshToken) {
      return NextResponse.json({ isValid: true }, { status: 200 });
    } else {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}
