import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);
const conversation =
  mongoose.models.conversation ||
  mongoose.model("conversation", ConversationSchema);
export default conversation;
