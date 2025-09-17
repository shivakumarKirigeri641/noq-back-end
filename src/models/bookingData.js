const mongoose = require("mongoose");

const bookingDataSchema = new mongoose.Schema(
  {
    sourceStation: {
      type: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: [String],
          required: true,
          minLength: 2,
          maxLength: 50,
        },
        code: {
          type: [String],
          required: true,
          minLength: 2,
          maxLength: 6,
        },
      },
      required: true,
    },
    destinationStation: {
      type: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: [String],
          required: true,
          minLength: 2,
          maxLength: 50,
        },
        code: {
          type: [String],
          required: true,
          minLength: 2,
          maxLength: 6,
        },
      },
      required: true,
    },
    dateOfJourney: { type: Date, required: true },
    adultsCount: { type: Number, default: 1, min: 1, max: 6, required: true },
    childrenCount: { type: Number, default: 0, min: 0, max: 6 },
    physicallyHandicapStatus: { type: Boolean, default: false },
    selfOrForOthersStatus: { type: Boolean, default: false },
    travellersmobileNumber: { type: String, minLength: 10, maxLength: 10 },
    bookersmobileNumber: { type: String, minLength: 10, maxLength: 10 },
    passengerDiscountDetails: {
      type: {
        childFareDiscount: {
          type: Number,
          default: 17,
          min: 0,
          max: 10000,
          required: true,
        },
        physicallyHandicappedDiscount: {
          type: Number,
          default: 15,
          min: 0,
          max: 100,
          required: true,
        },
        generalDiscount: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
          required: true,
        },
      },
      required: true,
    },
    trainAndFareDetails: {
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
