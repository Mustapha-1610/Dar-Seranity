import mongoose from "mongoose";
const Schema = mongoose.Schema;
const rentalPropertyListingsSchema = new Schema({
  enhancedVisibility: {
    type: Boolean,
    default: false,
  },
  featuredListing: {
    type: Boolean,
    default: false,
  },
  cityName: {
    type: String,
    required: true,
  },
  municipalityName: {
    type: String,
    required: true,
  },
  roomsCount: {
    kitchen: {
      type: Number,
    },
    livingRoom: {
      type: Number,
    },
    bedRoom: {
      type: Number,
    },
    restRoom: {
      type: Number,
    },
  },
  balcony: {
    type: Boolean,
    required: true,
  },
  garden: {
    type: Boolean,
    required: true,
  },
  propertyImages: [
    {
      type: String,
      required: true,
    },
  ],
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  landlordInformations: {
    name: {
      type: String,
    },
    id: {
      type: Schema.Types.ObjectId,
    },
    phoneNumber: {
      type: Number,
    },
  },
  transactionFees: {
    type: Number,
  },
  price: {
    type: Number,
  },
  scheduledViewings: [
    {
      renterName: {
        type: String,
      },
      renterId: {
        type: Schema.Types.ObjectId,
      },
      picture: {
        type: String,
      },
      familyCount: {
        type: Number,
      },
      viewingDate: {
        type: String,
      },
    },
  ],
  rented: {
    isRented: {
      type: Boolean,
      default: false,
    },
    renterProfilePictue: {
      type: String,
    },
    rentedOn: {
      type: String,
    },
    earned: {
      type: Number,
      default: 0,
    },
    isOnhold: {
      type: Boolean,
      default: false,
    },
    nextPaymentDate: {
      type: Date,
    },
  },
  ViewingRequests: [
    {
      renterName: {
        type: String,
      },
      renterId: {
        type: Schema.Types.ObjectId,
      },
      picture: {
        type: String,
      },
      familyCount: {
        adults: {
          type: Number,
        },
        children: {
          type: Number,
        },
        infants: {
          type: Number,
        },
      },
      suggestedViewingDate: {
        type: String,
      },
    },
  ],
  possibleRenters: [
    {
      renterId: {
        type: Schema.Types.ObjectId,
      },
      renterName: {
        type: String,
      },
      renterPicutre: {
        type: String,
      },
      responseStatus: {
        type: String,
        default: "No Offer Sent",
      },
    },
  ],
});
const rentalPropertyListing =
  mongoose.models.rentalPropertyListing ||
  mongoose.model("rentalPropertyListing", rentalPropertyListingsSchema);
export default rentalPropertyListing;
