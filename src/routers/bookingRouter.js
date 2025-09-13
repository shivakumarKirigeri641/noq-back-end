const express = require("express");
const { connectDB } = require("../database/connectDB");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const bookingRouter = express.Router();
const jwt = require("jsonwebtoken");
//get stations
bookingRouter.get(
  "/unreserved-ticket/stations",
  checkAuthentication,
  async (req, res) => {
    try {
      const pool = await connectDB(); // get the pool instance
      const client = await pool.connect();

      const result = await client.query(
        "select id, code, station_name, zone, address from stations order by code"
      );
      await client.release();
      return res.json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
    }
  }
);
//get trains on src, dest & doj selected
bookingRouter.get(
  "/unreserved-ticket/trains-list",
  checkAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const { src, dest, doj } = req.body;
      if (!src) {
        throw new Error("Source is invalid!");
      }
      if (!dest) {
        throw new Error("Source is invalid!");
      }
      const d = new Date();
      const shortWeekName = d
        .toLocaleDateString("en-US", {
          weekday: "short",
        })
        .toLowerCase();
      const result_fromtodetails = await client.query(
        "select *from stations where code = $1 or code= $2",
        [src.toUpperCase(), dest.toUpperCase()]
      );
      if (0 === result_fromtodetails.rows.length) {
        throw new Error("Source/Destination not valid!");
      }
      const result = await client.query(
        `select distinct t.train_number, t.zone, t.station_from as origin, t.station_to as destination, t.train_name, s1.station_code, s2.station_code, s1.arrival, s1.station_sequence, 
        s1.departure  from trains t join schedules s1 on t.train_number = s1.train_number join schedules s2 on t.train_number = s1.train_number 
where s1.station_code = $1 and s2.station_code=$2 and t.train_runs_on_${shortWeekName} = $3 and s1.station_sequence < s2.station_sequence and
(s1.arrival::time > (NOW() AT TIME ZONE 'Asia/Kolkata')::time or 
(s1.arrival::time is null and s1.departure::time > (NOW() AT TIME ZONE 'Asia/Kolkata')::time)) and s1.departure is not null order by s1.departure;
`,
        [src.toUpperCase(), dest.toUpperCase(), "Y"]
      );
      return res.json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
    } finally {
      await client.release();
    }
  }
);
//book-ticket
bookingRouter.post(
  "/unreserved-ticket/book-ticket",
  checkAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const {} = req.body;

      await client.query("COMMIT");
      return res.json({
        success: true,
      });
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
      await client.query("ROLLBACK");
    } finally {
      await client.release();
    }
  }
);
module.exports = bookingRouter;
