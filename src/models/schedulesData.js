const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
  stationCode: { type: String, required: true },
  stationName: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  departureTime: { type: String, required: true },
  routeNumber: { type: String, required: true },
  haltTime: { type: String, required: true },
  distance: { type: String, required: true },
  dayCount: { type: String, required: true },
  stnSerialNumber: { type: String, required: true },
  boardingDisabled: { type: String, required: true }, // could also be Boolean if always true/false
});

const schedulesDataSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true },
    trainName: { type: String, required: true },
    stationFrom: { type: String, required: true },
    stationTo: { type: String, required: true },

    trainRunsOnMon: { type: String, enum: ["Y", "N"], required: true },
    trainRunsOnTue: { type: String, enum: ["Y", "N"], required: true },
    trainRunsOnWed: { type: String, enum: ["Y", "N"], required: true },
    trainRunsOnThu: { type: String, enum: ["Y", "N"], required: true },
    trainRunsOnFri: { type: String, enum: ["Y", "N"], required: true },
    trainRunsOnSat: { type: String, enum: ["Y", "N"], required: true },
    trainRunsOnSun: { type: String, enum: ["Y", "N"], required: true },

    timeStamp: { type: Date, default: Date.now },

    stationList: [StationSchema],
  },
  { timestamps: true }
);
// compound indexes for faster queries
schedulesDataSchema.index({ fromStnCode: 1, toStnCode: 1 });
schedulesDataSchema.index({ trainNumber: 1, "stationList.stationCode": 1 });
module.exports = mongoose.model("schedulesData", schedulesDataSchema);
