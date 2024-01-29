import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { NextResponse } from "next/server";
connect();
export async function GET() {
  try {
    const properties = await rentalPropertyListing
      .find()
      .sort({ enhancedVisibility: -1 })
      .exec();
    return NextResponse.json({ success: true, properties });
  } catch (err) {
    return errorHandler(err);
  }
}
