const cookieParser = require("cookie-parser");
const connectDB = require("./database/connectDB");
const express = require("express");
const cors = require("cors");
const app = new express();
const authRouter = require("./routers/authRouter");
const stationsRouter = require("./routers/stationsRouter");
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://192.168.10.34:9876",
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/", stationsRouter);
connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(8888, () => {
      console.log("Server is listening now.");
    });
  })
  .catch((err) => {
    console.log("Error in connecting database: Error:" + err.message);
  });
