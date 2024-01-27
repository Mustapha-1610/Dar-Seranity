import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import subscriptionPacks from "@/Modals/RentalModals/subscriptionPacks";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { packageId } = reqBody;
    const existingPackage = await subscriptionPacks.findById(packageId);
    if (existingPackage) {
      return NextResponse.json({ success: true, packageData: existingPackage });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    return errorHandler(err);
  }
}
