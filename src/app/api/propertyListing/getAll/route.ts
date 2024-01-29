import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { NextResponse } from "next/server";
connect();
export async function GET() {
  try {
    const allPropertyListings = await rentalPropertyListing.find();
    return NextResponse.json({ success: true, allPropertyListings });
  } catch (err) {
    return errorHandler(err);
  }
}
