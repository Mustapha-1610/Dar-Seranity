import mongoose, { Types, model, models } from "mongoose";
import usersSchema from "@/Modals/UsersModals/users";
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
    required: true,
  },
});
const renter =
  mongoose.models.renter || mongoose.model("renter", renterUserSchema);
export default renter;
