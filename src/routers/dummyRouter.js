const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const dummyRouter = express.Router();
const jwt = require("jsonwebtoken");
dummyRouter.get("/test", async (req, res) => {
  try {
    res.send("test!");
  } catch (err) {
    res.status(502).json({ status: "Failed", message: err.message });
  }
});
module.exports = dummyRouter;
