const express = require("express");
const { connectDB } = require("../database/connectDB");
const checkAuthentication = require("../middleware/checkAuthentication");
const trainsRouter = express.Router();
//get trains based on src & dest provided with date (on clicking on search)
trainsRouter.post(
  "/unreserved-ticket/trains-list",
  checkAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const { src, dest } = req.body;
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
      //check if source is really present?
      const result_source = await client.query(
        "select code,station_name from stations where code =$1",
        [src.toUpperCase()]
      );
      //check if destination  is really present?
      const result_dest = await client.query(
        "select code,station_name from stations where code =$1",
        [dest.toUpperCase()]
      );
      if (0 === result_source.rows.length) {
        throw new Error("Invalid source!");
      }
      if (0 === result_dest.rows.length) {
        throw new Error("Invalid Destination!");
      }
      const result = await client.query(
        `select t.train_number, t.train_name, s1.arrival, s1.departure, s1.station_name as from_station, (s2.kilometer - s1.kilometer) as km, round((s2.kilometer - s1.kilometer)*0.3) as base_fare,
t.station_from as train_source, t.station_to as train_destination,
s2.station_name as to_station, s1.station_code as pass_from, s2.station_code as pass_to from schedules s1 join schedules s2 on s1.train_number = s2.train_number join
trains t on t.train_number = s1.train_number join coaches c on c.train_number = t.train_number
where
s1.station_code = $1 and 
s2.station_code=$2 and 
((s1.arrival is null and s1.departure BETWEEN CURRENT_TIME AND CURRENT_TIME + INTERVAL '2 hours' or
s1.arrival BETWEEN CURRENT_TIME AND CURRENT_TIME + INTERVAL '2 hours')) and
t.train_runs_on_${shortWeekName} = $3 and
c.gen=$4 and
s1.station_sequence <s2.station_sequence`,
        [src.toUpperCase(), dest.toUpperCase(), "Y", "Y"]
      );
      //user
      const result_user = await client.query(
        "select u.id as userid, w.id as walletid from walletdata w join users u on u.id = w.fkuser where u.mobile_number = $1",
        [req.mobile_number] //undiefind?
      );
      //insert into searchdata
      const result_searchquery = await client.query(
        "insert into searchdata (fkuser, source_code, destination_code, source, destination,dateofjourney) values ($1,$2,$3,$4,$5,$6)",
        [
          result_user.rows[0].userid,
          result_source.rows[0].code,
          result_dest.rows[0].code,
          result_source.rows[0].station_name,
          result_dest.rows[0].station_name,
          new Date(Date.now()),
        ]
      );
      if (0 < result.rows.length) {
        return res.json({
          success: true,
          data: result.rows,
          message: result.rows.length + " trains found.",
        });
      } else {
        return res.json({
          success: true,
          data: result.rows,
          message: "No trains found!",
        });
      }
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
    } finally {
      await client.release();
    }
  }
);
module.exports = trainsRouter;
