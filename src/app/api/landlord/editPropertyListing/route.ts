import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const res = await verifyLandlordToken(request);
    if (res.isValid) {
      const reqBody = await request.json();
      const { propertyId, removeListing } = reqBody;
      if (removeListing) {
        await rentalPropertyListing.findByIdAndDelete(propertyId);
        return NextResponse.json({ reposted: false });
      } else {
        const property = await rentalPropertyListing.findByIdAndUpdate(
          propertyId,
          {
            "rented.isOnhold": false,
            "rented.vacationDate": "",
            "rented.renterProfilePictue": "",
            "rented.nextPaymentDate": "",
          }
        );
        return NextResponse.json({ reposted: true, property });
      }
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
