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
      "https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/false1705809919539FzQFNXyWIAsKuau.jpg?alt=media&token=8e903ab6-861e-4a19-adb2-37c627442bf5",
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
        context: {
          type: String,
        },
        contextId: {
          type: String,
        },
      },
      recievedAt: {
        type: Date,
      },
      notificationImage: {
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
    },
  ],
  socketId: {
    type: String,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  scheduledViewings: [
    {
      renterId: {
        type: Schema.Types.ObjectId,
      },
      scheduledFor: {
        type: Date,
      },
      propertyTitle: {
        type: String,
      },
      propertyId: {
        type: Schema.Types.ObjectId,
      },
      renterName: {
        type: String,
      },
    },
  ],
  transactions: [
    {
      recievedAmount: {
        type: Number,
      },
      recievedOn: {
        type: Number,
      },
      recievedFrom: {
        type: String,
      },
      propertyInformations: {
        propertyTitle: {
          type: String,
        },
        propertyId: {
          type: Schema.Types.ObjectId,
        },
        transactionFee: {
          type: Number,
          default: 0,
        },
      },
    },
  ],
  phoneNumber: {
    type: Number,
  },
});
const landlord =
  mongoose.models.landlord || mongoose.model("landlord", landlordUserSchema);
export default landlord;
