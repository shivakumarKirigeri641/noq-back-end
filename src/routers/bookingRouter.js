const express = require("express");
const { connectDB } = require("../database/connectDB");
const getPNR = require("../uitls/getPNR");
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
//book-ticket
bookingRouter.post(
  "/unreserved-ticket/book-ticket",
  checkAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const {
        train_number,
        adults,
        child,
        physically_handicapped,
        total_fare,
        source_code,
        destination_code,
        pay_type,
      } = req.body;
      if (!train_number) {
        throw new Error("Invalid train!");
      }
      if (
        !adults ||
        !Number.isFinite(Number(adults)) ||
        1 > adults ||
        6 < adults
      ) {
        throw new Error("Invalid passenger count!");
      }
      if (!Number.isFinite(Number(child)) || 0 > child || 6 < child) {
        //dont check for !child and it will be always true if you pass 0
        throw new Error("Invalid minipassenger count!");
      }
      if (
        !total_fare ||
        !Number.isFinite(Number(total_fare) || 1 > total_fare)
      ) {
        throw new Error("Invalid fare!");
      }
      if (!source_code) {
        throw new Error("Invalid source/destination!");
      }
      if (!destination_code) {
        throw new Error("Invalid source/destination!");
      }
      //check if source is really present?
      const result_source = await client.query(
        "select code from stations where code =$1",
        [source_code.toUpperCase()]
      );
      //check if destination  is really present?
      const result_dest = await client.query(
        "select code from stations where code =$1",
        [destination_code.toUpperCase()]
      );
      if (0 === result_source.rows.length) {
        throw new Error("Invalid source!");
      }
      if (0 === result_dest.rows.length) {
        throw new Error("Invalid Destination!");
      }
      //pay type
      //dont check for !child and it will be always true if you pass 0
      if (0 != pay_type && 1 != pay_type) {
        throw new Error("Invalid pay type!");
      }
      //physically_handicapped
      if (!/^(true|false|1|0|yes|no)$/i.test(physically_handicapped)) {
        throw new Error("Invalid physically handicapped flag!");
      }
      //insert
      //user
      const result_user = await client.query(
        "select u.id as userid, w.id as walletid from walletdata w join users u on u.id = w.fkuser where u.mobile_number = $1",
        [req.mobile_number] //undiefind?
      );
      if (0 === result_user.rows.length) {
        throw new Error("User not found to book ticket!");
      }
      //src & dest names
      const result_stationnames = await client.query(
        "select departure, station_name from schedules where (station_code = $1 or station_code= $2) and train_number = $3 order by station_sequence asc;",
        [
          source_code.toUpperCase(),
          destination_code.toUpperCase(),
          train_number,
        ]
      );
      if (0 === result_stationnames.rows.length) {
        throw new Error("Station names invalid!");
      }
      let result_walletdeduction = null;
      if (0 === pay_type) {
        const result_walletdata = await client.query(
          "select id from walletdata where fkuser = $1",
          [result_user.rows[0].userid]
        );
        result_walletdeduction = await client.query(
          "insert into walletdeductiondata (fkwalletdata, deductamount, deductiontype) values ($1, $2, $3) returning *",
          [result_walletdata.rows[0].id, total_fare, 0]
        );
      }

      //insert
      const today = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      const result_traindetails = await client.query(
        "select *from trains where train_number=$1",
        [train_number]
      );
      const result_bookedticket = await client.query(
        `insert into journeyplandata (fkuser, source_code, destination_code, source, destination, train_number, train_name, dateofjourney, 
          adults, children, isphysicallyhandicapped, totalamount, paytype, fkwalletdeductiondata)
         values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, $14) returning *`,
        [
          result_user.rows[0].userid,
          result_source.rows[0].code,
          result_dest.rows[0].code,
          result_stationnames.rows[0].station_name,
          result_stationnames.rows[1].station_name,
          train_number,
          result_traindetails.rows[0].train_name,
          today,
          adults,
          child,
          physically_handicapped,
          total_fare,
          pay_type,
          result_walletdeduction ? result_walletdeduction.rows[0].id : null,
        ]
      );
      //generate ticket
      const pnr = getPNR();
      const transactionid = getPNR(); //for transactionid
      const result_ticket = await client.query(
        `insert into ticketdata (fkjourneyplandata, pnr, departure, pnrstatus, transactionid) values ($1, $2, $3, $4, $5) returning *`,
        [
          result_bookedticket.rows[0].id,
          pnr,
          result_stationnames.rows[0].departure,
          0,
          transactionid,
        ]
      );

      await client.query("COMMIT");
      return res.json({
        success: true,
        message: "Ticket is confirmed.",
        data: {
          train_details: {
            train_number,
            train_name: result_traindetails.rows[0].train_name,
            source: result_stationnames.rows[0].station_name,
            destination: result_stationnames.rows[1].station_name,
            train_origin: result_traindetails.station_from,
            train_stop: result_traindetails.station_to,
          },
          ticket_details: {
            pnr: result_ticket.rows[0].pnr,
            pnr_status: result_ticket.rows[0].pnrstatus,
            scheduled_departure: result_ticket.rows[0].departure,
            ticket_confirmation_datetime: result_ticket.rows[0].created_at,
          },
          booking_details: {
            adults: result_bookedticket.rows[0].adults,
            children: result_bookedticket.rows[0].children,
            physically_handicapped:
              result_bookedticket.rows[0].isphysicallyhandicapped,
          },
          pay_details: {
            total_fare: result_bookedticket.rows[0].totalamount,
            conveience_fee: 1.8,
            payment_integration_fees: 1.3,
            concession: 0,
            paytype:
              0 === result_bookedticket.rows[0].paytype ? "online" : "wallet",
          },
          comments: [
            "Ticket valid till mentioned destination only",
            "Ticket is strictly NOT transferable",
          ],
        },
      });
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
      await client.query("ROLLBACK");
    } finally {
      await client.release();
    }
  }
);

//booking-history
bookingRouter.get(
  "/unreserved-ticket/booking-history",
  checkAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const mobile_number = req.mobile_number;
      if (!mobile_number) {
        throw new Error("Invalid mobile number!");
      }
      await client.query("BEGIN");
      const reslt_pnrfulldetails = await client.query(
        `SELECT t.pnr, t.pnrstatus, t.departure, t.datenadtimeofconfirmation, j.source_code,
j.destination_code, j.source, j.destination, j.train_number, j.train_name,
j.dateofjourney, j.adults, j.children, j.isphysicallyhandicapped, j.totalamount, j.paytype,
u.mobile_number from ticketdata t join journeyplandata j on j.id = t.fkjourneyplandata join
users u on j.fkuser = u.id
where u.mobile_number = $1
`,
        [mobile_number]
      );
      await client.query("COMMIT");
      if (0 === reslt_pnrfulldetails.rows.length) {
        res.status(200).json({
          status: "Ok",
          message: "No tickets found",
          data: reslt_pnrfulldetails.rows,
        });
      } else {
        res.status(200).json({
          status: "Ok",
          message: "Details fetch successful",
          data: reslt_pnrfulldetails.rows,
        });
      }
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
      await client.query("ROLLBACK");
    } finally {
      await client.release();
    }
  }
);
module.exports = bookingRouter;
