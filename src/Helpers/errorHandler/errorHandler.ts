import { NextResponse } from "next/server";
export function errorHandler(err: any) {
  console.log(err);
  return NextResponse.json({
    serverError: "Internal Server Error",
    status: 500,
  });
}
