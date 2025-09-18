const serveless = require("serverless-http");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./database/connectDB");
require("./schedulars/newSeatAllocationCron");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = new express();
const authRouter = require("./routers/authRouter");
const stationsRouter = require("./routers/stationsRouter");
const trainsRouter = require("./routers/trainsRouter");
const dummyRouter1 = require("./routers/dummyRouter1");
const bookingRouter = require("./routers/bookingRouter");
const ttRouter = require("./routers/ttRouter");
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:1234",
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/", stationsRouter);
app.use("/", bookingRouter);
app.use("/", trainsRouter);
//app.use("/", dummyRouter1);
app.use("/", ttRouter);
connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(process.env.OPTIONALPORT, () => {
      console.log("Server is listening now.");
    });
  })
  .catch((err) => {
    console.log("Error in connecting database: Error:" + err.message);
  });
module.exports.handler = serveless(app);
