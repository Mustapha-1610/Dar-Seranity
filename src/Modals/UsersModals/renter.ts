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
    required: true,
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
  rentedProperties: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      propertyName: {
        type: String,
        required: true,
      },
      rentedOn: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  activationCode: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
});
const renter =
  mongoose.models.renter || mongoose.model("renter", renterUserSchema);
export default renter;
