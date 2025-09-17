const mongoose = require("mongoose");

const priceDataSchema = new mongoose.Schema(
  {
    baseFare: { type: String, required: true },
    reservationCharge: { type: String, default: "0" },
    superfastCharge: { type: String, default: "0" },
    fuelAmount: { type: String, default: "0" },
    totalConcession: { type: String, default: "0" },
    tatkalFare: { type: String, default: "0" },
    serviceTax: { type: String, default: "0" },
    otherCharge: { type: String, default: "0" },
    cateringCharge: { type: String, default: "0" },
    dynamicFare: { type: String, default: "0" },
    totalFare: { type: String, required: true },

    trainNumber: { type: String, required: true },
    timeStamp: { type: String, required: true },
    fromStnCode: { type: String, required: true },
    toStnCode: { type: String, required: true },
    classCode: { type: String, required: true },
    distance: { type: String, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);
// compound indexes
priceDataSchema.index({ fromStnCode: 1, toStnCode: 1 });
priceDataSchema.index({ trainNumber: 1, classCode: 1 });

const priceData = mongoose.model("priceData", priceDataSchema);

module.exports = priceData;
