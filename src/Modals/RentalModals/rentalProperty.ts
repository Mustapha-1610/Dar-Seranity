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
      type: String,
    },
  },
});
const rentalPropertyListing =
  mongoose.models.rentalPropertyListing ||
  mongoose.model("rentalPropertyListing", rentalPropertyListingsSchema);
export default rentalPropertyListing;
