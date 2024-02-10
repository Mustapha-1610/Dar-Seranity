import { errorHandler } from "@/Helpers/errorHandler/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import messages from "@/Modals/MessagingModals/message";
import conversation from "@/Modals/MessagingModals/conversation";
import { connect } from "@/DataBase/dbConfig";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { senderId, recieverId } = reqBody;
    const newConversation = new conversation({
      members: [senderId, recieverId],
    });
    const savedConversation = await newConversation.save();
    return NextResponse.json({ savedConversation });
  } catch (err) {
    return errorHandler(err);
  }
}
