import mongoose from "mongoose";
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
      "https://firebasestorage.googleapis.com/v0/b/tunibids.appspot.com/o/Windows_10_Default_Profile_Picture.svg.png?alt=media&token=e7aca30d-6eea-45ff-8522-db048fcb8c38",
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
    Gold: {
      type: Number,
      default: 0,
    },
    Silver: {
      type: Number,
      default: 0,
    },
    Basic: {
      type: Number,
      default: 1,
    },
  },
  createdPropertyListings: [
    {
      roumNumbers: {
        kitchen: {
          type: Number,
        },
        livingRoom: {
          type: Number,
        },
        restRoom: {
          type: Number,
        },
        bedRoom: {
          type: Number,
        },
      },
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
      createdAt: {
        type: Date,
      },
      rented: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
const landlord =
  mongoose.models.landlord || mongoose.model("landlord", landlordUserSchema);
export default landlord;
