import { connect } from "@/DataBase/dbConfig";
import { refreshAccessToken } from "@/Helpers/RouteProtection/refreshRenterToken";
import { verifyRenterToken } from "@/Helpers/RouteProtection/renterRouteProtection";
import { returnRenterObject } from "@/Helpers/backFunctions/renterBackFunctions";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const res: any = await verifyRenterToken(request);
    if (res.isValid) {
      const renterAccount = res.renterAccount;
      renterAccount.notifications.forEach((notification: any) => {
        notification.readStatus = true;
      });
      await renterAccount.save();
      const renterFrontData = await returnRenterObject(renterAccount);
      return refreshAccessToken(renterFrontData, null, res.newAccessToken);
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
