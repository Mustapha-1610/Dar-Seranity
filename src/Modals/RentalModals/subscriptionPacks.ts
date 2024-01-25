import mongoose, { Types, model, models } from "mongoose";
const Schema = mongoose.Schema;
const subscriptionPacksSchema = new Schema({
  name: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  additions: [
    {
      type: String,
    },
  ],
  negatives: [
    {
      type: String,
    },
  ],
  subscribers: [
    {
      Name: {
        type: String,
        required: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        ref: "landlord",
      },
    },
  ],
});
const subscriptionPacks =
  mongoose.models.subscriptionPacks ||
  mongoose.model("subscriptionPacks", subscriptionPacksSchema);
export default subscriptionPacks;
