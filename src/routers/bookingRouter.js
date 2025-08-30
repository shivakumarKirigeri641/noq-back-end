const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const bookingRouter = express.Router();
const jwt = require("jsonwebtoken");
bookingRouter.get(
  "/noq/noqunreservedticket/confirmbooking",
  checkAuthentication,
  async (req, res) => {
    //HERE YOU have to creat jwt token and send it
    try {
      res.send("login created!");
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
    }
  }
);
module.exports = bookingRouter;
