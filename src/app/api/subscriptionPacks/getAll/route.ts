import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextResponse } from "next/server";
import subscriptionPacks from "@/Modals/RentalModals/subscriptionPacks";
connect();
export async function GET() {
  try {
    const packNames = await subscriptionPacks.find();
    return NextResponse.json({ packNames });
  } catch (err) {
    return errorHandler(err);
  }
}
