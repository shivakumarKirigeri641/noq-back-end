const express = require("express");
const fs = require("fs");
const { connectDB } = require("../database/connectDB");
require("dotenv").config();
const dummyRouter1 = express.Router();
dummyRouter1.post("/createtablequeries", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // start transaction
    //all create table query goes here
    // Drop old triggers & function
    await client.query("DROP FUNCTION IF EXISTS set_updated_at() CASCADE;");

    // Drop tables in reverse order (safe cascade)
    await client.query("DROP TABLE IF EXISTS ticketData CASCADE;");
    await client.query("DROP TABLE IF EXISTS journeyPlanData CASCADE;");
    await client.query("DROP TABLE IF EXISTS searchData CASCADE;");
    await client.query("DROP TABLE IF EXISTS walletCreditData CASCADE;");
    await client.query("DROP TABLE IF EXISTS walletDeductionData CASCADE;");
    await client.query("DROP TABLE IF EXISTS walletData CASCADE;");
    await client.query("DROP TABLE IF EXISTS userLoginCountList CASCADE;");
    await client.query("DROP TABLE IF EXISTS ttLoginCountList CASCADE;");
    await client.query("DROP TABLE IF EXISTS ttLogin CASCADE;");
    await client.query("DROP TABLE IF EXISTS users CASCADE;");

    // Users
    await client.query(
      "CREATE TABLE users (id SERIAL PRIMARY KEY, mobile_number TEXT NOT NULL, created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );

    // Wallet tables
    await client.query(
      "CREATE TABLE walletData (id SERIAL PRIMARY KEY, fkUser INT REFERENCES users(id) ON DELETE CASCADE, balance NUMERIC NOT NULL, dateAndTimeOfEntry TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );
    await client.query(
      "CREATE TABLE walletDeductionData (id SERIAL PRIMARY KEY, fkWalletData INT REFERENCES walletData(id) ON DELETE CASCADE, deductAmount NUMERIC NOT NULL, dateAndTimeOfDeduction TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), deductionType INT NOT NULL, created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );
    await client.query(
      "CREATE TABLE walletCreditData (id SERIAL PRIMARY KEY, fkWalletData INT REFERENCES walletData(id) ON DELETE CASCADE, creditAmount NUMERIC NOT NULL, dateAndTimeOfCredit TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), payType INT NOT NULL, created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );

    // Search & Journey
    await client.query(
      "CREATE TABLE searchData (id SERIAL PRIMARY KEY, fkUser INT REFERENCES users(id) ON DELETE CASCADE, source_code TEXT NOT NULL, destination_code TEXT NOT NULL, source TEXT NOT NULL, destination TEXT NOT NULL, dateOfJourney TIMESTAMP WITHOUT TIME ZONE NOT NULL, dateOfSearch TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );
    await client.query(
      "CREATE TABLE journeyPlanData (id SERIAL PRIMARY KEY, fkUser INT REFERENCES users(id) ON DELETE CASCADE, source_code TEXT NOT NULL, destination_code TEXT NOT NULL, source TEXT NOT NULL, destination TEXT NOT NULL, train_number TEXT NOT NULL, train_name TEXT NOT NULL, dateOfJourney TIMESTAMP WITHOUT TIME ZONE NOT NULL, adults INT NOT NULL, children INT NOT NULL, isPhysicallyHandicapped BOOLEAN DEFAULT FALSE, totalAmount NUMERIC NOT NULL, payType INT NOT NULL, transactionId TEXT NOT NULL, fkWalletDeductionData INT REFERENCES walletDeductionData(id) ON DELETE SET NULL, created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );

    // TT login
    await client.query(
      "CREATE TABLE ttLogin (id SERIAL PRIMARY KEY, tt_id TEXT UNIQUE NOT NULL, mobile_number TEXT NOT NULL, created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );

    // Tickets
    await client.query(
      "CREATE TABLE ticketData (id SERIAL PRIMARY KEY, fkJourneyPlanData INT REFERENCES journeyPlanData(id) ON DELETE CASCADE, pnr TEXT NOT NULL, dateAndTimeOfConfirmation TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), departure TIMESTAMP WITHOUT TIME ZONE NOT NULL, pnrStatus INT NOT NULL, comments TEXT, verified_by INT REFERENCES ttLogin(id) ON DELETE SET NULL, created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );

    // Login count lists
    await client.query(
      "CREATE TABLE userLoginCountList (id SERIAL PRIMARY KEY, fkUser INT REFERENCES users(id) ON DELETE CASCADE, dateAndTime TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );
    await client.query(
      "CREATE TABLE ttLoginCountList (id SERIAL PRIMARY KEY, fkTtLogin INT REFERENCES ttLogin(id) ON DELETE CASCADE, dateAndTime TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'), updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'));"
    );

    // Trigger function
    await client.query(
      "CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;"
    );

    // Attach triggers to every table
    await client.query(
      "CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_walletData_updated_at BEFORE UPDATE ON walletData FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_walletDeductionData_updated_at BEFORE UPDATE ON walletDeductionData FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_walletCreditData_updated_at BEFORE UPDATE ON walletCreditData FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_searchData_updated_at BEFORE UPDATE ON searchData FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_journeyPlanData_updated_at BEFORE UPDATE ON journeyPlanData FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_ttLogin_updated_at BEFORE UPDATE ON ttLogin FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_ticketData_updated_at BEFORE UPDATE ON ticketData FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_userLoginCountList_updated_at BEFORE UPDATE ON userLoginCountList FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );
    await client.query(
      "CREATE TRIGGER trg_ttLoginCountList_updated_at BEFORE UPDATE ON ttLoginCountList FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    );

    //all create table query goes here

    await client.query("COMMIT"); // commit transaction
    res.json({ status: "Ok" });
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on error
    console.error("Transaction error:", err.message);
    res.json({ status: "Error", error: err.message });
  } finally {
    await client.release(); // release client back to pool
  }
});
dummyRouter1.post("/stations", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const data = fs.readFileSync(
      "C:\\Users\\shiva\\source\\repos\\json_files\\stations.json",
      "utf8"
    );
    const stations = JSON.parse(data);

    let index = 0;
    for (const station of stations) {
      if (!station.trainCount) {
        station.trainCount = 0;
      }
      console.log("inserting:", index++ + "/" + stations.length);
      await client.query(
        `INSERT INTO stations 
          (name, code, utterances, name_hi, name_gu, district, state, trainCount, latitude, longitude, address)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (code) DO NOTHING`, // prevents duplicate codes
        [
          station.name,
          station.code,
          station.utterances,
          station.name_hi,
          station.name_gu,
          station.district,
          station.state,
          station.trainCount,
          station.latitude,
          station.longitude,
          station.address,
        ]
      );
    }

    await client.query("COMMIT");
    res.send("ok");
  } catch (err) {
    await client.query("ROLLBACK");
    res.json({ status: "no ok", data: err.message });
  } finally {
    await client.release();
  }
});
module.exports = dummyRouter1;
