const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
authRouter.get("/noq/noqunreservedticket/login", async (req, res) => {
  //HERE YOU have to creat jwt token and send it
  try {
    const token = await jwt.sign(
      "_id", //_id
      process.env.SECRET_KEY
    );
    res.cookie("token", token, {
      expiresIn: "1d",
    });
    res.send("login created!");
  } catch (err) {
    res.status(502).json({ status: "Failed", message: err.message });
  }
});
authRouter.get(
  "/noq/noqunreservedticket/stations",
  checkAuthentication,
  async (req, res) => {
    res.send("test");
  }
);
module.exports = authRouter;
