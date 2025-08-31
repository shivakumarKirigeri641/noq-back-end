const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
authRouter.post("/noq/noqunreservedticket/login", async (req, res) => {
  //HERE YOU have to creat jwt token and send it
  try {
    const token = await jwt.sign(
      "_id", //_id
      process.env.SECRET_KEY
    );
    res.cookie("token", token, {
      expiresIn: "30s",
    });
    res.send("login created!");
  } catch (err) {
    res.status(502).json({ status: "Failed", message: err.message });
  }
});
module.exports = authRouter;
