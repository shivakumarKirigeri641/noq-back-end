const express = require("express");
const { connectDB } = require("../database/connectDB");
require("dotenv").config();
const dummyRouter1 = express.Router();
dummyRouter1.post("/createtablequeries", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // start transaction
    //all create table query goes here
    await client.query(
      "DROP TRIGGER IF EXISTS trg_wallet_deduction ON Wallet_Deductions"
    );
    await client.query(
      "DROP TRIGGER IF EXISTS trg_wallet_credit ON Wallet_Credits"
    );
    await client.query("DROP FUNCTION IF EXISTS update_wallet_on_deduction()");
    await client.query("DROP FUNCTION IF EXISTS update_wallet_on_credit()");
    await client.query("DROP TABLE IF EXISTS TTLoginCountList CASCADE");
    await client.query("DROP TABLE IF EXISTS TTLogin CASCADE");
    await client.query("DROP TABLE IF EXISTS UserLoginCountList CASCADE");
    await client.query("DROP TABLE IF EXISTS Tickets CASCADE");
    await client.query("DROP TABLE IF EXISTS Journey_Plans CASCADE");
    await client.query("DROP TABLE IF EXISTS Searches CASCADE");
    await client.query("DROP TABLE IF EXISTS Wallet_Credits CASCADE");
    await client.query("DROP TABLE IF EXISTS Wallet_Deductions CASCADE");
    await client.query("DROP TABLE IF EXISTS Wallets CASCADE");
    await client.query("DROP TABLE IF EXISTS Users CASCADE");

    await client.query(
      "CREATE TABLE Users(user_id SERIAL PRIMARY KEY,mobile_number CHAR(10) NOT NULL UNIQUE,created_at TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME)"
    );
    await client.query("CREATE INDEX idx_users_mobile ON Users(mobile_number)");

    await client.query(
      "CREATE TABLE TTLogin(id SERIAL PRIMARY KEY,tt_id TEXT NOT NULL UNIQUE,mobile_number CHAR(10) NOT NULL UNIQUE,created_at TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME)"
    );
    await client.query(
      "CREATE INDEX idx_ttlogin_mobile ON TTLogin(mobile_number)"
    );

    await client.query(
      "CREATE TABLE Wallets(wallet_id SERIAL PRIMARY KEY,user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,balance NUMERIC(12,2) NOT NULL DEFAULT 0,entry_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME)"
    );
    await client.query("CREATE INDEX idx_wallets_user ON Wallets(user_id)");

    await client.query(
      "CREATE TABLE Wallet_Deductions(deduction_id SERIAL PRIMARY KEY,wallet_id INT NOT NULL REFERENCES Wallets(wallet_id) ON DELETE CASCADE,deduction_amount NUMERIC(12,2) NOT NULL,deduction_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME,deduction_type SMALLINT NOT NULL)"
    );
    await client.query(
      "CREATE INDEX idx_deductions_wallet ON Wallet_Deductions(wallet_id)"
    );

    await client.query(
      "CREATE TABLE Wallet_Credits(credit_id SERIAL PRIMARY KEY,wallet_id INT NOT NULL REFERENCES Wallets(wallet_id) ON DELETE CASCADE,credit_amount NUMERIC(12,2) NOT NULL,credit_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME,pay_type SMALLINT NOT NULL)"
    );
    await client.query(
      "CREATE INDEX idx_credits_wallet ON Wallet_Credits(wallet_id)"
    );

    await client.query(
      "CREATE TABLE Searches(search_id SERIAL PRIMARY KEY,user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,source_code TEXT NOT NULL,destination_code TEXT NOT NULL,source TEXT NOT NULL,destination TEXT NOT NULL,journey_datetime TIME WITHOUT TIME ZONE NOT NULL,search_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME)"
    );
    await client.query(
      "CREATE INDEX idx_searches_user_journey ON Searches(user_id, journey_datetime)"
    );

    await client.query(
      "CREATE TABLE Journey_Plans(journey_plan_id SERIAL PRIMARY KEY,user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,source_code TEXT NOT NULL,destination_code TEXT NOT NULL,source TEXT NOT NULL,destination TEXT NOT NULL,journey_datetime TIME WITHOUT TIME ZONE NOT NULL,adults SMALLINT NOT NULL,children SMALLINT NOT NULL,is_physically_handicapped BOOLEAN NOT NULL DEFAULT FALSE,total_amount NUMERIC(12,2) NOT NULL,pay_type SMALLINT NOT NULL,transaction_id TEXT NOT NULL,wallet_deduction_id INT REFERENCES Wallet_Deductions(deduction_id),train_number TEXT,train_name TEXT,tt_id TEXT)"
    );
    await client.query(
      "CREATE INDEX idx_journey_user_date ON Journey_Plans(user_id, journey_datetime)"
    );
    await client.query(
      "CREATE INDEX idx_journey_wallet_deduction ON Journey_Plans(wallet_deduction_id)"
    );

    await client.query(
      "CREATE TABLE Tickets(ticket_id SERIAL PRIMARY KEY,journey_plan_id INT NOT NULL REFERENCES Journey_Plans(journey_plan_id) ON DELETE CASCADE,pnr TEXT NOT NULL UNIQUE,confirmation_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME,departure_time TIME WITHOUT TIME ZONE NOT NULL,pnr_status SMALLINT NOT NULL,comments TEXT)"
    );
    await client.query(
      "CREATE INDEX idx_ticket_journey_pnr ON Tickets(journey_plan_id, pnr)"
    );
    await client.query(
      "CREATE INDEX idx_ticket_departure ON Tickets(departure_time)"
    );

    await client.query(
      "CREATE TABLE UserLoginCountList(login_id SERIAL PRIMARY KEY,user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,otp NUMERIC(6) NOT NULL,date_and_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME)"
    );
    await client.query(
      "CREATE INDEX idx_userlogin_user ON UserLoginCountList(user_id)"
    );

    await client.query(
      "CREATE TABLE TTLoginCountList(login_id SERIAL PRIMARY KEY,tt_id INT NOT NULL REFERENCES TTLogin(id) ON DELETE CASCADE,otp NUMERIC(6) NOT NULL,date_and_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME)"
    );
    await client.query(
      "CREATE INDEX idx_ttlogincount_tt ON TTLoginCountList(tt_id)"
    );

    await client.query(
      "CREATE OR REPLACE FUNCTION update_wallet_on_deduction() RETURNS TRIGGER AS $$ BEGIN UPDATE Wallets SET balance = balance - NEW.deduction_amount WHERE wallet_id = NEW.wallet_id; RETURN NEW; END; $$ LANGUAGE plpgsql"
    );
    await client.query(
      "CREATE TRIGGER trg_wallet_deduction AFTER INSERT ON Wallet_Deductions FOR EACH ROW EXECUTE FUNCTION update_wallet_on_deduction()"
    );

    await client.query(
      "CREATE OR REPLACE FUNCTION update_wallet_on_credit() RETURNS TRIGGER AS $$ BEGIN UPDATE Wallets SET balance = balance + NEW.credit_amount WHERE wallet_id = NEW.wallet_id; RETURN NEW; END; $$ LANGUAGE plpgsql"
    );
    await client.query(
      "CREATE TRIGGER trg_wallet_credit AFTER INSERT ON Wallet_Credits FOR EACH ROW EXECUTE FUNCTION update_wallet_on_credit()"
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
module.exports = dummyRouter1;
