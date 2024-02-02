import mongoose, { Types, model, models } from "mongoose";
const Schema = mongoose.Schema;
const renterUserSchema = new Schema({
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
  landlordReviews: [
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
      sentAt: {
        type: Date,
      },
      notificationImage: {
        type: String,
      },
    },
  ],
  rentedProperties: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      propertyTitle: {
        type: String,
        required: true,
      },
      rentedOn: {
        type: Date,
      },
      price: {
        type: Number,
      },
    },
  ],
  viewingSchedules: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      propertyTitle: {
        type: String,
        required: true,
      },
      scheduledFor: {
        type: String,
      },
    },
  ],
  ViewingRequests: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      propertyTitle: {
        type: String,
        required: true,
      },
      submittedOn: {
        type: Date,
      },
      acceptanceStatus: {
        type: Boolean,
      },
      scheduledFor: {
        type: String,
      },
    },
  ],
  rentalOffers: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
      },
      rentingPrice: {
        type: Number,
      },
      sentOn: {
        type: Date,
      },
      propertyTitle: {
        type: String,
      },
    },
  ],
  activationCode: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  gmailAccount: {
    type: Boolean,
    default: false,
  },
  savedRentalProperties: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
      },
      propertyTitle: {
        type: String,
      },
      propertyDescription: {
        type: String,
      },
    },
  ],
  duePayments: [
    {
      date: {
        type: Date,
      },
      rentCost: {
        type: Number,
      },
    },
  ],
  socketId: {
    type: String,
  },
});
const renter =
  mongoose.models.renter || mongoose.model("renter", renterUserSchema);
export default renter;
