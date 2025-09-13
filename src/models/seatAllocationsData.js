const mongoose = require("mongoose");
const seatsAllocationSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
    },
    dateOfJourney: {
      type: Date,
      required: true,
    },
    seats: {
      sl: [
        {
          coachNumber: {
            type: String,
            required: true,
          },
          seatNo: {
            type: Number,
            required: true,
          },
          seatSequence: {
            type: Number,
            required: true,
          },
          reservationType: {
            type: Number,
            required: true,
            default: 0, //0-gen, 1-tatkal, 2-pre.tatkal
          },
          seatStatus: {
            type: String,
            enum: ["booked", "available", "cancelled", "staff"],
            required: true,
            default: "available",
          },
          PNR: {
            type: String,
            default: "-1",
          },
        },
      ],
      a1: [
        {
          coachNumber: {
            type: String,
            required: true,
          },
          seatNo: {
            type: Number,
            required: true,
          },
          seatSequence: {
            type: Number,
            required: true,
          },
          reservationType: {
            type: Number,
            required: true,
            default: 0, //0-gen, 1-tatkal, 2-pre.tatkal
          },
          seatStatus: {
            type: String,
            enum: ["booked", "available", "cancelled", "staff"],
            required: true,
            default: "available",
          },
          PNR: {
            type: String,
            default: "-1",
          },
        },
      ],
      a2: [
        {
          coachNumber: {
            type: String,
            required: true,
          },
          seatNo: {
            type: Number,
            required: true,
          },
          seatSequence: {
            type: Number,
            required: true,
          },
          reservationType: {
            type: Number,
            required: true,
            default: 0, //0-gen, 1-tatkal, 2-pre.tatkal
          },
          seatStatus: {
            type: String,
            enum: ["booked", "available", "cancelled", "staff"],
            required: true,
            default: "available",
          },
          PNR: {
            type: String,
            default: "-1",
          },
        },
      ],
      a3: [
        {
          coachNumber: {
            type: String,
            required: true,
          },
          seatNo: {
            type: Number,
            required: true,
          },
          seatSequence: {
            type: Number,
            required: true,
          },
          reservationType: {
            type: Number,
            required: true,
            default: 0, //0-gen, 1-tatkal, 2-pre.tatkal
          },
          seatStatus: {
            type: String,
            enum: ["booked", "available", "cancelled", "staff"],
            required: true,
            default: "available",
          },
          PNR: {
            type: String,
            default: "-1",
          },
        },
      ],
      cc: [
        {
          coachNumber: {
            type: String,
            required: true,
          },
          seatNo: {
            type: Number,
            required: true,
          },
          seatSequence: {
            type: Number,
            required: true,
          },
          reservationType: {
            type: Number,
            required: true,
            default: 0, //0-gen, 1-tatkal, 2-pre.tatkal
          },
          seatStatus: {
            type: String,
            enum: ["booked", "available", "cancelled", "staff"],
            required: true,
            default: "available",
          },
          PNR: {
            type: String,
            default: "-1",
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const seatAllocationData = mongoose.model(
  "seatAllocationData",
  seatsAllocationSchema
);

module.exports = seatAllocationData;
