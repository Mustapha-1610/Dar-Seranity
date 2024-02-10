import { connect } from "@/DataBase/dbConfig";
import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import conversation from "@/Modals/MessagingModals/conversation";
import messages from "@/Modals/MessagingModals/message";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { sender, text, conversationId } = reqBody;
    const newMessage = await messages.create({ sender, text, conversationId });

    return NextResponse.json({ newMessage });
  } catch (err) {
    return errorHandler(err);
  }
}
