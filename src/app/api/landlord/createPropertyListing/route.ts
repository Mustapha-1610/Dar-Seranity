import { connect } from "@/DataBase/dbConfig";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import cities from "@/Modals/UtilityModals/cities";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse = await verifyLandlordToken(request);
    if (routeProtectionResponse.isValid) {
      const reqBody = await request.json();
      let {
        chosenPack,
        cityId,
        municipalityName,
        imageUrls,
        kitchenCount,
        livingRoomCount,
        restRoomCount,
        bedroomCount,
        garden,
        balcony,
      } = reqBody;
      if (
        !chosenPack ||
        !cityId ||
        !municipalityName ||
        !kitchenCount ||
        !livingRoomCount ||
        !restRoomCount ||
        !bedroomCount ||
        !garden ||
        !balcony
      ) {
        return NextResponse.json({ error: "Missing Inputs !" });
      } else if (!imageUrls) {
        return NextResponse.json({
          error:
            "You Are Required To Upload Atleast One Picture Of The Property !",
        });
      } else {
        const landlordData = routeProtectionResponse.landlordAccount;
        if (chosenPack) {
          if (landlordData.propertyListingsCount[chosenPack] > 0) {
            landlordData.propertyListingsCount[chosenPack] = -1;
            const cityName = await cities.findById(cityId);
            const newPropertyListing = await rentalPropertyListing.create({
              cityName: cityName.City,
              municipalityName,
              roomsCount: {
                kitchen: kitchenCount,
                livingRoom: livingRoomCount,
                bedRoom: bedroomCount,
                restRoom: restRoomCount,
              },
              garden,
              balcony,
              propertyImages: imageUrls,
              enhancedVisibility: chosenPack !== "basic",
              featuredListing: chosenPack === "gold",
            });
            await landlordData.save();
            return NextResponse.json({ success: "Created" });
          } else {
            return NextResponse.json({
              error:
                "You Do Not Own Anymore Listings From This Pack : " +
                chosenPack,
            });
          }
        } else {
          return NextResponse.json({
            error:
              "You Need To Select Which Type Of Listing You Are Creating Before Submitting !",
          });
        }
      }
    } else {
      return NextResponse.json("test");
    }
  } catch (err) {
    return errorHandler(err);
  }
}
