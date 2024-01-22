import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/DataBase/dbConfig";
import subscriptionPacks from "@/Modals/RentalModals/subscriptionPacks";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id, price, additions, negatives } = reqBody;
    const updatedPack = await subscriptionPacks.findByIdAndUpdate(
      { _id },
      {
        $set: {
          price: price && price,
          additions: additions && additions,
          negatives: negatives && negatives,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedPack) {
      return NextResponse.json({ error: "Pack Was Not Found !" });
    } else {
      return NextResponse.json({ success: "Updated Successfully !" });
    }
  } catch (err) {
    return errorHandler(err);
  }
}
