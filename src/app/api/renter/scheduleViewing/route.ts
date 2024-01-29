import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest } from "next/server";
import renter from "@/Modals/UsersModals/renter";
import rentalPropertyListing from "@/Modals/RentalModals/rentalProperty";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyRenterToken(request);
    if (routeProtectionResponse.isValid) {
      const reqBody = await request.json();
      const { adults, children, infants, propertyId, viewingDate } = reqBody;
      const propetyInfos = await rentalPropertyListing.findByIdAndUpdate(
        propertyId,
        {
          $push: {
            scheduledListings: {
              renterName: routeProtectionResponse.renterAccount.name,
              picture: routeProtectionResponse.renterAccount.profilePicture,
              renterId: routeProtectionResponse.renterAccount._id,
              familyCount: {
                adults,
                children,
                infants,
              },

              suggestedViewingDate: viewingDate,
            },
          },
        }
      );
      routeProtectionResponse.renterAccount.viewingSchedules.push({
        propertyId: propetyInfos._id,
        propertyTitle: propetyInfos.title,
        submittedOn: new Date(),
        scheduledFor: viewingDate,
      });
      await routeProtectionResponse.renterAccount.save();
      const renterFrontData = returnRenterObject(request);
      return refreshAccessToken(
        renterFrontData,
        routeProtectionResponse.newAccessToken
      );
    } else {
      return routeProtectionResponse.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
