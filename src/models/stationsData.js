const { default: mongoose } = require("mongoose");

const stationsDataSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 50,
    required: true,
  },
  code: {
    type: String,
    minLength: 2,
    maxLength: 5,
    required: true,
  },
  utterances: {
    type: [String],
  },
  name_hi: {
    type: String,
    minLength: 2,
    maxLength: 25,
  },
  state: {
    type: String,
    minLength: 2,
    maxLength: 35,
  },
  address: {
    type: String,
    minLength: 2,
    maxLength: 35,
  },
  trainCount: {
    type: Number,
    minLength: 0,
    maxLength: 1000,
  },
  latitude: {
    type: Number,
    minLength: 0,
    maxLength: 1000,
  },
  longitude: {
    type: Number,
    minLength: 0,
    maxLength: 1000,
  },
});
// indexes for faster searching
stationsDataSchema.index({ name: 1 }); // search by station name
stationsDataSchema.index({ state: 1 }); // search by region
stationsDataSchema.index({ latitude: 1, longitude: 1 }); // geospatial queries if needed
const stationsData = mongoose.model("stationsData", stationsDataSchema);
module.exports = stationsData;
