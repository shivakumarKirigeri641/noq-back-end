const mongoose = require("mongoose");

const confirmedTicketDataSchema = new mongoose.Schema(
  {
    fkBookingData: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    pnrNumber: {
      type: String,
      required: true,
    },
    validationId: {
      type: String,
      required: true,
    },
    expiryStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    dateAndTimeOfBooking: { type: Date, required: true },
    approxArrivalDateAndTime: { type: Date },
    approxDepartureDateAndTime: { type: Date, required: true },
    paymentType: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 3,
    },
  },
  { timestamps: true }
);

const confirmedTicketData = mongoose.model(
  "confirmedTicketData",
  confirmedTicketDataSchema
);

module.exports = confirmedTicketData;
