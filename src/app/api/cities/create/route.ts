import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import cities from "@/Modals/UtilityModals/cities";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { cityName, municipalityName } = reqBody;
    await cities.create({
      City: cityName,
      Municipality: [municipalityName],
    });
    return NextResponse.json({ success: "Created !" });
  } catch (err) {
    return errorHandler(err);
  }
}
