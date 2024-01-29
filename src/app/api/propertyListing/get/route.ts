import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { propertyId } = reqBody;
    const propertyListing = await rentalPropertyListing.findById(propertyId);
    if (propertyListing) {
      return NextResponse.json({ success: true, propertyListing });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    return errorHandler(err);
  }
}
