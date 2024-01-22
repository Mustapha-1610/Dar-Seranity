import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import subscriptionPacks from "@/Modals/RentalModals/subscriptionPacks";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { price, additions, negatives } = reqBody;
    if (!price || !additions || !negatives) {
      return NextResponse.json({ error: "Missing Inputs" });
    } else {
      const existingPack = await subscriptionPacks.findOne({ price: price });
      if (existingPack) {
        return NextResponse.json({
          error: "A Pack Allready Exist's With The Same Price",
        });
      } else {
        await subscriptionPacks.create({
          price,
          additions,
          negatives,
        });
        return NextResponse.json({ success: "Pack Added" });
      }
    }
  } catch (err) {
    return errorHandler(err);
  }
}
