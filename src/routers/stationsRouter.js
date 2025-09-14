const express = require("express");
const getWeekDayNameInShort = require("../uitls/getWeekDayNameInShort");
const checkAuthentication = require("../middleware/checkAuthentication");
const stationsRouter = express.Router();
const { connectDB } = require("../database/connectDB");
stationsRouter.get(
  "/unreserved-ticket/stations",
  checkAuthentication,
  async (req, res) => {
    try {
      const pool = await connectDB(); // get the pool instance
      const client = await pool.connect();
      const result = await client.query(
        "select *from stations order by code asc"
      );
      res.status(200).json({ status: "STATUS_OK", data: result });
    } catch (err) {
      res.send("errlr:" + err.message);
    }
  }
);
module.exports = stationsRouter;
