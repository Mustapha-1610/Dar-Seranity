import { connect } from "@/DataBase/dbConfig";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { refreshLandlordToken } from "@/Helpers/RouteProtection/refreshLandlordToken";
import { returnLandlordObject } from "@/Helpers/backFunctions/returnLandlordObject";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import subscriptionPacks from "@/Modals/RentalModals/subscriptionPacks";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const routeProtectionResponse: any = await verifyLandlordToken(request);
    if (routeProtectionResponse.isValid) {
      const reqBody = await request.json();
      const { packageId } = reqBody;
      const landlordData: any = routeProtectionResponse.landlordAccount;
      const packageData: any = await subscriptionPacks.findById(packageId);
      if (packageData) {
        landlordData.propertyListingsCount[packageData.name] +=
          packageData.listingsCount;
        packageData.subscribers.subscribersCount += 1;
        packageData.subscribers.subscribersInformations.push({
          name: landlordData.name + landlordData.surname,
          id: landlordData._id,
        });
        await packageData.save();
        await landlordData.save();

        const frontLandlordData = await returnLandlordObject(
          routeProtectionResponse.landlordAccount
        );
        return refreshLandlordToken(
          frontLandlordData,
          null,
          routeProtectionResponse.newAccessToken
            ? routeProtectionResponse.newAccessToken
            : null
        );
      } else {
        return NextResponse.json({ success: false });
      }
    } else {
      return routeProtectionResponse.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
