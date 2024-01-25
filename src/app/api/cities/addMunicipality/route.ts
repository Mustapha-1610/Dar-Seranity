import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import cities from "@/Modals/UtilityModals/cities";
import { connect } from "@/DataBase/dbConfig";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { cityId, municipalityName } = reqBody;
    await cities.findByIdAndUpdate(cityId, {
      $push: {
        Municipality: municipalityName,
      },
    });
    return NextResponse.json({ success: "Municipality Added" });
  } catch (err) {
    return errorHandler(err);
  }
}
