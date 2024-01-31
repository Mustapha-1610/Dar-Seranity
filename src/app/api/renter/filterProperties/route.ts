import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import cities from "@/Modals/UtilityModals/cities";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { cityId, municipalityName, garden, balcony } = reqBody;
    let cityName: any = null;
    if (cityId) {
      cityName = await cities.findById(cityId);
    }
    console.log(reqBody);
    if (cityId && cityId !== "") {
      if (municipalityName && municipalityName !== "") {
        const properties = await rentalPropertyListing.find({
          cityName: cityName.City,
          municipalityName,
          garden,
          balcony,
        });
        return NextResponse.json({ properties });
      } else {
        const properties = await rentalPropertyListing.find({
          cityName: cityName.City,
          garden,
          balcony,
        });
        return NextResponse.json({ properties });
      }
    } else {
      const properties = await rentalPropertyListing.find({
        garden,
        balcony,
      });
      return NextResponse.json({ properties });
    }
  } catch (err) {
    return errorHandler(err);
  }
}
