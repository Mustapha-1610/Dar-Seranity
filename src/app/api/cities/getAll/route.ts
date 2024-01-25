import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import cities from "@/Modals/UtilityModals/cities";
import { connect } from "@/DataBase/dbConfig";
connect();
export async function GET(request: NextRequest) {
  try {
    const Cities = await cities.find();
    return NextResponse.json({ Cities });
  } catch (err) {
    return errorHandler(err);
  }
}
