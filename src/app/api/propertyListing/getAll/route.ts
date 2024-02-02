import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { NextResponse } from "next/server";
connect();
export async function POST() {
  try {
    const properties = await rentalPropertyListing
      .find({ "rented.isRented": false })
      .sort({ enhancedVisibility: -1 })
      .exec();
    return NextResponse.json({ success: true, properties });
  } catch (err) {
    return errorHandler(err);
  }
}
