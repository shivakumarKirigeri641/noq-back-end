const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
//login
authRouter.post("/noq/noqunreservedticket/login", async (req, res) => {
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
//logout
authRouter.post("/twogms/logout", checkAuthentication, async (req, res) => {
  //firsrt check if mobile number valid (exists in coll
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).json({ status: "Ok", message: "Logout Successful" });
  } catch (err) {
    res.status(401).json({ status: "Failed", message: err.message });
  }
});
module.exports = authRouter;
