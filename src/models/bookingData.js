const mongoose = require("mongoose");

const bookingDataSchema = new mongoose.Schema(
  {
    sourceStation: { type: String, required: true },
    destinationStation: { type: String, required: true },
    dateAndTimeOfJourney: { type: Date, required: true },
    adultsCount: { type: Number, default: 1, min: 1, max: 6, required: true },
    childrenCount: { type: Number, default: 0, min: 0, max: 6 },
    physicallyHandicapStatus: { type: Boolean, default: false },
    selfOrForOthersStatus: { type: Boolean, default: false },
    mobileNumber: { type: String, minLength: 10, maxLength: 10 },
    fareDetails: {
      type: {
        farePerIndividual: {
          type: Number,
          default: 0,
          min: 0,
          max: 10000,
          require: true,
        },
        childFarePerIndividual: {
          type: Number,
          default: 0,
          min: 0,
          max: 10000,
          require: true,
        },
        physicallyHandicappedDiscount: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
          require: true,
        },
        generalDiscount: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
          require: true,
        },
      },
      required: true,
    },
    trainDetails: {
      type: {
        trainNumber: {
          type: Number,
          default: 0,
          required: true,
        },
        trainName: {
          type: String,
          default: "",
          minLength: 0,
          maxLength: 50,
          required: true,
        },
        trainFarePerIndividual: {
          type: Number,
          default: 0,
          min: 0,
          max: 10000,
          require: true,
        },
      },
      required: true,
    },
  },
  { timestamps: true }
);

const bookingData = mongoose.model("bookingData", bookingDataSchema);

module.exports = bookingData;
