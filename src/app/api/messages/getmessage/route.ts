import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import conversation from "@/Modals/MessagingModals/conversation";
import messages from "@/Modals/MessagingModals/message";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { conversationId } = reqBody;
    const messagesLogs = await messages.find({
      conversationId: conversationId,
    });
    return NextResponse.json({ messagesLogs });
  } catch (err) {
    return errorHandler(err);
  }
}
