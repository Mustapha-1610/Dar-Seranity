import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import landlord from "@/Modals/UsersModals/landlord";
import renter from "@/Modals/UsersModals/renter";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { renterId, rentalPropertyId } = reqBody;
    console.log(reqBody);
    const renterAccount = await renter.findById(renterId);
    const rentalProperty = await rentalPropertyListing.findById(
      rentalPropertyId
    );
    renterAccount.viewingSchedules = renterAccount.viewingSchedules.filter(
      (property: any) =>
        property.propertyId.toString() !== rentalPropertyId.toString()
    );
    rentalProperty.scheduledViewings = rentalProperty.scheduledViewings.filter(
      (renter: any) => renter.renterId.toString() !== renterId.toString()
    );
    rentalProperty.possibleRenters.push({
      renterId,
      renterName: renterAccount.name + " " + renterAccount.surname,
      renterPicutre: renterAccount.profilePicture,
    });
    const landlordAccount = await landlord.findById({
      _id: rentalProperty.landlordInformations.id,
    });
    await renterAccount.save();
    await rentalProperty.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorHandler(err);
  }
}
