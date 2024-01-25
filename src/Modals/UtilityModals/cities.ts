import mongoose from "mongoose";
const Schema = mongoose.Schema;
const citiesSchema = new Schema({
  City: {
    type: String,
  },

  Municipality: [
    {
      type: String,
    },
  ],
});
const cities = mongoose.models.cities || mongoose.model("cities", citiesSchema);
export default cities;
