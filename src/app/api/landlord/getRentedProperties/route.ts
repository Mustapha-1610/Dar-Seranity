import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
connect();
export async function POST(request: NextRequest) {
  try {
    const res = await verifyLandlordToken(request);
    if (res.isValid) {
      const landlordId = res.landlordAccount._id;

      const propertyListing = await rentalPropertyListing.find({
        "landlordInformations.id": landlordId,
      });
      if (propertyListing) {
        return NextResponse.json({ success: true, propertyListing });
      } else {
        return NextResponse.json({ success: false });
      }
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
