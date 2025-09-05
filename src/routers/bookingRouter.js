const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const bookingRouter = express.Router();
const jwt = require("jsonwebtoken");
bookingRouter.get(
  "/noq/noqunreservedticket/confirmbooking",
  checkAuthentication,
  async (req, res) => {
    try {
      //generate PNR number
      //generate download id
      //generate validation id
      //expiry status
      const errors = validateTicketData(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const pnrNumber = getPNR();
      const validationId = getValidationId("VAL-");
      const downloadId = getDownLoadId("DWN-");
      const now = new Date();
      const expiryDate = getExpiryDate();
      res.send("login created!");
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
    }
  }
);
module.exports = bookingRouter;
