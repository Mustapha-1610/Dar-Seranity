import mongoose, { Types, model, models } from "mongoose";
const Schema = mongoose.Schema;
const landlordUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&token=e213ccd5-50fc-45a8-99ba-d4eaef019d73",
  },
  verificationStatus: {
    type: Boolean,
    default: false,
  },
  activationStatus: {
    type: Boolean,
    default: true,
  },
  userReviews: [
    {
      reviewerName: {
        type: String,
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
    },
  ],
  notifications: [
    {
      notificationsMessage: {
        type: String,
        required: true,
      },
      readStatus: {
        type: Boolean,
        default: false,
      },
      notificationContext: {
        type: String,
      },
    },
  ],
  idCardFrontSideImage: {
    type: String,
    required: true,
  },
  idCardBackSideImage: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  propertyListingsCount: {
    gold: {
      type: Number,
      default: 0,
    },
    silver: {
      type: Number,
      default: 0,
    },
    basic: {
      type: Number,
      default: 1,
    },
  },
  createdPropertyListings: [
    {
      title: {
        type: String,
      },
      propertyId: {
        type: String,
      },
      images: [
        {
          type: String,
        },
      ],
      createdAd: {
        type: Date,
      },
    },
  ],
});
const landlord =
  mongoose.models.landlord || mongoose.model("landlord", landlordUserSchema);
export default landlord;
