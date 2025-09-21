const cookieParser = require("cookie-parser");
const { connectDB } = require("./database/connectDB");
require("./schedulars/newSeatAllocationCron");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = new express();
const os = require("os");
const process = require("process");
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
    origin: "http://localhost:3000",
    credentials: true,
  })
);
let tokens = {}; // Example token storage
/*app.options(
  "*",
  cors({
    origin: process.env.UIURL,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);*/
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
function logStats() {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  console.log("--- Server Stats ---");
  console.log(`RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(`CPU User: ${cpuUsage.user / 1000} ms`);
  console.log(`CPU System: ${cpuUsage.system / 1000} ms`);
  console.log(`Token Count: ${Object.keys(tokens).length}`);
  console.log("--------------------");
}

// Log stats every 30 seconds
setInterval(logStats, 30 * 1000);

// Catch unhandled errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
