const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const { connectDB } = require("../database/connectDB");
//login
authRouter.post("/unreserved-ticket/verifyotp", async (req, res) => {
  try {
    const { mobilenumber, otp } = req.body;
    if (!mobilenumber || !/^\d{10}$/.test(mobilenumber)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid mobile number" });
    }
    if (!otp || 4 !== otp.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid mobile otp provided!" });
    }
    //check if mobile number exists?

    //if no, insert
    //else get the primary id and insert into userloginlistcount table
    //insert query
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    let result_mobilenumberdetails = await client.query(
      "select id from users where mobile_number = $1",
      [mobilenumber]
    );
    if (0 === result_mobilenumberdetails.rows.length) {
      result_mobilenumberdetails = await client.query(
        "insert into users (mobile_number) values ($1) returning *",
        [mobilenumber]
      );
    }
    await client.query("insert into userlogincountlist (fkuser) values ($1)", [
      result_mobilenumberdetails.rows[0].id,
    ]);
    const token = await jwt.sign({ mobilenumber }, process.env.SECRET_KEY, {
      expiresIn: "100s",
    });
    req.mobile_number = mobilenumber;
    req.mobileid = result_mobilenumberdetails.rows[0].mobile_number;
    res.cookie("token", token);
    return res.json({
      success: true,
      message: "Mobile number and OTP verified successfully.",
    });
  } catch (err) {
    return res.status(502).json({ status: "Failed", message: err.message });
  }
});
module.exports = authRouter;
