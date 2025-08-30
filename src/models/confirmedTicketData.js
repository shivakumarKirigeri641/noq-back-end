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
    downloadId: {
      type: String,
      required: true,
    },
    expiryStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    dateAndTimeOfTicketBooking: { type: Date, required: true },
    dateAndTimeOfTicketExpiry: { type: Date, required: true },
    approxArrivalDateAndTime: { type: Date },
    approxDepartureDateAndTime: { type: Date, required: true },
    paymentType: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 3,
    },
    //qur code, scaning this turns to true & record the date & time, this confirms that you have really taken the ticket
    boardingTrainDetails: {
      type: {
        boardingStatus: {
          type: Boolean,
          required: true,
          default: false,
        },
        dateAndTimeOfBoarding: {
          type: Date,
        },
      },
    },
  },
  { timestamps: true }
);

const confirmedTicketData = mongoose.model(
  "confirmedTicketData",
  confirmedTicketDataSchema
);

module.exports = confirmedTicketData;
