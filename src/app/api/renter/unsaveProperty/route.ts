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
      const reqBody = await request.json();
      const { propertyId } = reqBody;
      res.renterAccount.savedRentalProperties =
        res.renterAccount.savedRentalProperties.filter(
          (item: any) => item.propertyId.toString() !== propertyId
        );
      await res.renterAccount.save();
      const renterFrontData = returnRenterObject(res.renterAccount);
      return refreshAccessToken(renterFrontData, res.newAccessToken);
    } else {
      return res.response;
    }
  } catch (err) {
    return errorHandler(err);
  }
}
