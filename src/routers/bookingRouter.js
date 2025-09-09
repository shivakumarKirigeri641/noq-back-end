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
        "select id, code, name from stations order by name asc"
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
        `select s.train_runs_on_${shortWeekName}, t1.train_number, s.train_name, t1.arrival_time::time, t1.departure_time::time from trains_and_stations_arrdept t1 join 
trains_and_stations_arrdept t2 on t1.train_number = t2.train_number join schedules s on t1.train_number = s.train_number where 
t1.station_code = $1 and t2.station_code=$2 and t1.stn_serial_number < t2.stn_serial_number 
and s.train_runs_on_tue =$3 and (t1.arrival_time::time > (NOW() AT TIME ZONE 'Asia/Kolkata')::time or 
(t1.arrival_time::time is null and t1.departure_time::time > (NOW() AT TIME ZONE 'Asia/Kolkata')::time)) order by departure_time asc`,
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
module.exports = bookingRouter;
