const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  displayNamePrefix: {
    type: String,
    required: true,
  },
  bogiCount: {
    type: Number,
    required: true,
  },
  totalSeatCount: {
    type: Number,
    required: true,
  },
  seatPercent_General: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  seatPercent_Tatkal: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  seatPercent_PremimuTatkal: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const coachDataSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      unique: true,
    },
    coach_sl: {
      type: coachSchema,
      required: true,
    },
    coach_1a: {
      type: coachSchema,
      required: true,
    },
    coach_2a: {
      type: coachSchema,
      required: true,
    },
    coach_3a: {
      type: coachSchema,
      required: true,
    },
    coach_cc: {
      type: coachSchema,
      required: true,
    },
    coach_ec: {
      type: coachSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const CoachData = mongoose.model("CoachData", coachDataSchema);

module.exports = CoachData;
