const express = require("express");
const priceData = require("../models/priceData");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const dummyRouter = express.Router();
const jwt = require("jsonwebtoken");
dummyRouter.get("/test", async (req, res) => {
  try {
    const priceDetails = await priceData.find({
      $and: [
        { trainNumber: "16535" },
        { fromStnCode: "YPR" },
        { toStnCode: "DVG" },
      ],
    });
    res.send(priceDetails);
  } catch (err) {
    res.status(502).json({ status: "Failed", message: err.message });
  }
});
module.exports = dummyRouter;
