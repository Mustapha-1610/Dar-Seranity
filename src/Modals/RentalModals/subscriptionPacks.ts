import mongoose, { Types, model, models } from "mongoose";
const Schema = mongoose.Schema;
const subscriptionPacksSchema = new Schema({
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
      _id: {
        type: Schema.Types.ObjectId,
        ref: "landlord",
        unique: true,
      },
    },
  ],
});
const renter =
  mongoose.models.subscriptionPacks ||
  mongoose.model("subscriptionPacks", subscriptionPacksSchema);
export default renter;
