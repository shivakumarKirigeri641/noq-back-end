const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const { connectDB } = require("../database/connectDB");
authRouter.post("/unreserved-ticket/send-otp", async (req, res) => {
  try {
    const { mobile_number, otp } = req.body;
    if (!mobile_number || !/^\d{10}$/.test(mobile_number)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid mobile number" });
    }
    return res.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    return res.status(502).json({ status: "Failed", message: err.message });
  }
});
//login
authRouter.post("/unreserved-ticket/verifyotp", async (req, res) => {
  try {
    const { mobile_number, otp } = req.body;
    if (!mobile_number || !/^\d{10}$/.test(mobile_number)) {
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
      [mobile_number]
    );
    if (0 === result_mobilenumberdetails.rows.length) {
      result_mobilenumberdetails = await client.query(
        "insert into users (mobile_number) values ($1) returning *",
        [mobile_number]
      );
      //insert wallet data
      result_walletdata = await client.query(
        "insert into walletdata (fkuser, balance) values ($1, $2) returning *",
        [result_mobilenumberdetails.rows[0].id, 1000]
      );
      //insert wallet data credit
      result_walletdata = await client.query(
        "insert into walletcreditdata (fkwalletdata, creditamount,paytype) values ($1, $2, $3) returning *",
        [result_walletdata.rows[0].id, 1000, 0]
      );
    }
    await client.query("insert into userlogincountlist (fkuser) values ($1)", [
      result_mobilenumberdetails.rows[0].id,
    ]);
    const token = await jwt.sign({ mobile_number }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    req.mobile_number = mobile_number;
    req.mobileid = result_mobilenumberdetails.rows[0].mobile_number;
    //res.cookie("token", token);
    res.cookie("token", token, {
      expiresIn: "1d",
    });
    return res.json({
      success: true,
      message: "Mobile number and OTP verified successfully.",
    });
  } catch (err) {
    return res.status(502).json({ status: "Failed", message: err.message });
  }
});
//tt-login
authRouter.post("/unreserved-ticket/ttlogin/verifyotp", async (req, res) => {
  try {
    const { mobile_number, ttid, otp } = req.body;
    if (!mobile_number || !/^\d{10}$/.test(mobile_number)) {
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
      "select id from ttlogin where mobile_number = $1 and tt_id = $2",
      [mobile_number, ttid]
    );
    if (0 === result_mobilenumberdetails.rows.length) {
      result_mobilenumberdetails = await client.query(
        "insert into ttlogin (mobile_number) values ($1) returning *",
        [mobile_number]
      );
    }
    await client.query("insert into ttlogincountlist (fkttlogin) values ($1)", [
      result_mobilenumberdetails.rows[0].id,
    ]);
    const token = await jwt.sign({ mobile_number }, process.env.SECRET_KEY, {
      expiresIn: "100s",
    });
    req.mobile_number = mobile_number;
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
