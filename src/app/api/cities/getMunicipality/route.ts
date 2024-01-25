import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import cities from "@/Modals/UtilityModals/cities";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { cityId } = reqBody;
    const citiesData = await cities.findById(cityId);
    return NextResponse.json({ municipality: citiesData.Municipality });
  } catch (err) {
    return errorHandler(err);
  }
}
