import { NextResponse } from "next/server";
export function errorHandler(err: any) {
  console.log(err);
  return NextResponse.json({
    serverError: "Internal Server Error",
    error: "Server Error Try Again Later !",
    status: 500,
  });
}
