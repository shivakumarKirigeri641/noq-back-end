const express = require("express");
const priceData = require("../models/priceData");
const getWeekDayNameInShort = require("../uitls/getWeekDayNameInShort");
const checkAuthentication = require("../middleware/checkAuthentication");
const stationsRouter = express.Router();
const stationsData = require("../models/stationsData");
const schedulesData = require("../models/schedulesData");
//get the list of stations
stationsRouter.get(
  "/noq/noqunreservedticket/stations",
  checkAuthentication,
  async (req, res) => {
    try {
      const data = await stationsData.find({}).select("_id code name name_hi");
      res.status(200).json({ status: "STATUS_OK", data });
    } catch (err) {
      res.send("errlr");
    }
  }
);
module.exports = stationsRouter;
