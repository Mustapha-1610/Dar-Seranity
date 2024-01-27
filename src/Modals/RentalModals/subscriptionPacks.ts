import mongoose from "mongoose";
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
  subscribers: {
    subscribersCount: {
      type: Number,
    },
    subscribersInformations: [
      {
        name: {
          type: String,
        },
        id: {
          type: Schema.Types.ObjectId,
        },
      },
    ],
  },
  listingsCount: {
    type: Number,
  },
  transactionFees: {
    type: Number,
  },
});
const subscriptionPacks =
  mongoose.models.subscriptionPacks ||
  mongoose.model("subscriptionPacks", subscriptionPacksSchema);
export default subscriptionPacks;
