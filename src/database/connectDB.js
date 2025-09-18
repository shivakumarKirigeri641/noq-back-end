// connectDB.js
const { Pool } = require("pg");
let pool;
const connectDB = async () => {
  if (!pool) {
    pool = new Pool({
      /*host: process.env.PGHOST_LOCAL,
      user: process.env.PGUSER_LOCAL,
      password: process.env.PGPASSWORD_LOCAL,
      database: process.env.PGDATABASE_LOCAL,
      port: process.env.PGPORT,*/
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT,
      ssl: { rejectUnauthorized: false }, // needed for AWS RDS
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
