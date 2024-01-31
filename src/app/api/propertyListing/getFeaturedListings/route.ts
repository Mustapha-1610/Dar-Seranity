import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { NextResponse } from "next/server";

connect();

export async function POST() {
  try {
    // Use MongoDB's aggregation pipeline to fetch 3 random documents
    const randomProperties = await rentalPropertyListing
      .aggregate([
        { $match: { featuredListing: true } }, // Match documents with featuredListing set to true
        { $sample: { size: 3 } }, // Randomly select 3 documents from the matched results
      ])
      .exec();

    console.log(randomProperties);
    return NextResponse.json({ randomProperties });
  } catch (err) {
    return errorHandler(err);
  }
}
