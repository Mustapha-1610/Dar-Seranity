import mongoose from "mongoose";
const Schema = mongoose.Schema;
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);
const messages =
  mongoose.models.messages || mongoose.model("messages", MessageSchema);
export default messages;
