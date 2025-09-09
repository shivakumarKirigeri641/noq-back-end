const express = require("express");
const { connectDB } = require("../database/connectDB");
require("dotenv").config();
const dummyRouter1 = express.Router();
dummyRouter1.post("/testremote", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // start transaction
    await client.query(
      "CREATE TABLE IF NOT EXISTS sample_table (id SERIAL PRIMARY KEY, name VARCHAR(100));"
    );
    await client.query("COMMIT"); // commit transaction
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on error
    console.error("Transaction error:", err.message);
  } finally {
    await client.release(); // release client back to pool
  }
});
module.exports = dummyRouter1;
