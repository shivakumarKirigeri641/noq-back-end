const express = require("express");
require("dotenv").config();
const ttRouter = express.Router();
const jwt = require("jsonwebtoken");
const { connectDB } = require("../database/connectDB");
const checkTTAuthentication = require("../middleware/checkTTAuthentication");
//verify-ticket
ttRouter.get(
  "/unreserved-ticket/tt-data/verify-ticket/:pnr",
  checkTTAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const pnr = req.params.pnr;
      if (!pnr) {
        throw new Error("Invalid PNR!");
      }
      await client.query("BEGIN");
      const reslt_pnrfulldetails = await client.query(
        `SELECT t.id as ticketid, t.pnr, t.pnrstatus, t.departure, t.datenadtimeofconfirmation, j.source_code,
j.destination_code, j.source, j.destination, j.train_number, j.train_name,
j.dateofjourney, j.adults, j.children, j.isphysicallyhandicapped, j.totalamount, j.paytype,
u.mobile_number from ticketdata t join journeyplandata j on j.id = t.fkjourneyplandata join
users u on j.fkuser = u.id
where t.pnr = $1
`,
        [pnr]
      );
      if (0 === reslt_pnrfulldetails.rows.length) {
        return res.status(200).json({
          status: "Ok",
          message: "No tickets found",
          data: reslt_pnrfulldetails.rows,
          pnr_status: "",
        });
      }
      const result_verification_details = await client.query(
        "select *from ttverificationdata where fkticketdata = $1",
        [reslt_pnrfulldetails.rows[0].ticketid]
      );
      if (0 < result_verification_details.rows.length) {
        return res.status(200).json({
          status: "Ok",
          message:
            "Ticket has been already verified on " +
            result_verification_details.rows[0].dateandtimeofverification,
          data: reslt_pnrfulldetails.rows,
          pnr_status: "",
        });
      }
      await client.query("COMMIT");
      res.status(200).json({
        status: "Ok",
        message: "Details fetch successful",
        data: reslt_pnrfulldetails.rows,
        pnr_status: "Active",
      });
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
      await client.query("ROLLBACK");
    } finally {
      await client.release();
    }
  }
);
//confirm ticket verification
ttRouter.put(
  "/unreserved-ticket/tt-data/tt-confirm-ticket-verification/:pnr",
  checkTTAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const pnr = req.params.pnr;
      if (!pnr) {
        throw new Error("Invalid PNR!");
      }
      await client.query("BEGIN");
      //first get details
      const reslt_pnrfulldetails = await client.query(
        `SELECT t.id as tickectid, t.pnr, t.pnrstatus, t.departure, t.datenadtimeofconfirmation, j.source_code,
j.destination_code, j.source, j.destination, j.train_number, j.train_name,
j.dateofjourney, j.adults, j.children, j.isphysicallyhandicapped, j.totalamount, j.paytype,
u.mobile_number from ticketdata t join journeyplandata j on j.id = t.fkjourneyplandata join
users u on j.fkuser = u.id
where t.pnr = $1
`,
        [pnr]
      );
      //get tt details,
      const result_ttdetails = await client.query(
        "select *from ttlogin where mobile_number=$1",
        [req.mobile_number]
      );
      if (1 === reslt_pnrfulldetails.rows[0].pnrstatus) {
        return res.status(200).json({
          status: "Ok",
          message: "Ticket already verified!",
          pnr_status: "Checked now",
        });
      }
      await client.query(
        `update ticketdata set pnrstatus=$1 where pnr =$2, verfied_by=$3`,
        [1, pnr, result_ttdetails.rows[0].id]
      );
      await client.query(
        `insert into ttverificationdata (fkttid, fkticketdata) values ($1, $2)`,
        [result_ttdetails.rows[0].id, reslt_pnrfulldetails.rows[0].tickectid]
      );
      await client.query("COMMIT");
      res.status(200).json({
        status: "Ok",
        message: "Ticket verification successful",
        pnr_status: "Checked now",
      });
    } catch (err) {
      res.status(502).json({ status: "Failed", message: err.message });
      await client.query("ROLLBACK");
    } finally {
      await client.release();
    }
  }
);
//ticket verifiaction history
ttRouter.post(
  "/unreserved-ticket/tt-data/verify-ticket-history",
  checkTTAuthentication,
  async (req, res) => {
    const pool = await connectDB(); // get the pool instance
    const client = await pool.connect();
    try {
      const { mobile_number } = req.body;
      if (!mobile_number) {
        throw new Error("Invalid mobile number!");
      }
      await client.query("BEGIN");
      const reslt_pnrfulldetails = await client.query(
        `select tl.mobile_number, tl.tt_id,t.pnr, t.pnrstatus, t.comments, t.departure, j.source_code, j.destination_code,
j.source, j.destination, j.adults, j.children, j.totalamount,
tt.dateandtimeofverification from ttverificationdata tt join ticketdata t on t.id = tt.fkticketdata 
join ttlogin tl on tl.id = tt.fkttid
join journeyplandata j on t.fkjourneyplandata = j.id
where tl.mobile_number = $1 and t.verified_by = tl.id
`,
        [mobile_number]
      );
      await client.query("COMMIT");
      if (0 === reslt_pnrfulldetails.rows.length) {
        res.status(200).json({
          status: "Ok",
          message: "No verification details found",
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
module.exports = ttRouter;
