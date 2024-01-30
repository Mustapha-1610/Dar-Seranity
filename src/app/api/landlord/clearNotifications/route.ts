import { connect } from "@/DataBase/dbConfig";
import { verifyLandlordToken } from "@/Helpers/RouteProtection/landlorRouteProtection";
import { refreshLandlordToken } from "@/Helpers/RouteProtection/refreshLandlordToken";
import { returnLandlordObject } from "@/Helpers/backFunctions/returnLandlordObject";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const res: any = await verifyLandlordToken(request);
    if (res.isValid) {
      const landlordData = res.landlordAccount;
      landlordData.notifications.forEach((notification: any) => {
        notification.readStatus = true;
      });
      await landlordData.save();
      console.log(landlordData);
      const landlordFrontData = await returnLandlordObject(landlordData);
      return refreshLandlordToken(landlordFrontData, null, res.newAccessToken);
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
