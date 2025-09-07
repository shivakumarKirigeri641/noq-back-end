// connectDB.js
const { Pool } = require("pg");
let pool;
const connectDB = async () => {
  if (!pool) {
    pool = new Pool({
      user: "postgres",
      host: "localhost",
      password: "641641",
      database: "NoQ",
      port: 5432,
    });
  }
  return pool; // return pool instance
};

module.exports = { connectDB };

/*require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.CONNECTION_SECRETKEY);
};
module.exports = { connectDB };*/
