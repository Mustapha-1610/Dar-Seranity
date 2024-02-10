import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import conversation from "@/Modals/MessagingModals/conversation";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userId } = reqBody;
    const conversations = await conversation.find({
      members: { $in: [userId] },
    });
    return NextResponse.json({ conversations });
  } catch (err) {
    return errorHandler(err);
  }
}
