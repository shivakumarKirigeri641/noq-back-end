const express = require("express");
const cron = require("node-cron");
const getPNR = require("../uitls/getPNR");
const priceData = require("../models/priceData");
const schedulesData = require("../models/schedulesData");
const coachData = require("../models/coachData");
const fs = require("fs");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const dummyRouter = express.Router();
const jwt = require("jsonwebtoken");
const getIntRandomNumber = require("../uitls/getIntRandomNumber");
const seatAllocationData = require("../models/seatAllocationsData");
const { connectDB } = require("../database/connectDB");
const getSLString = require("../uitls/getSLString");
const getSeatDetails = require("../uitls/is_Gen_SeatsAvailable");
const is_Premium_Tatkal_SeatsAvailable = require("../uitls/is_Premium_Tatkal_SeatsAvailable");
const is_Tatkal_SeatsAvailable = require("../uitls/is_Tatkal_SeatsAvailable");
const is_Gen_SeatsAvailable = require("../uitls/is_Gen_SeatsAvailable");
const getAvailableSeatsCount = require("../uitls/getAvailableSeatsCount");
const getWaitingListCount = require("../uitls/getWaitingListCount");
const getGenConfOnly = require("../uitls/getGenConfOnly");
dummyRouter.post("/1test", async (req, res) => {
  try {
    coachData.collection.drop();
    /*const priceDetails = await priceData.distinct("classCode", {
      $and: [{ trainNumber: "16535" }],
    });
    res.send(priceDetails);*/
    const trainnumbers = await schedulesData.distinct("trainNumber");
    for (let i = 0; i < trainnumbers.length; i++) {
      console.log(i);
      const coachData_info = new coachData({
        trainNumber: trainnumbers[i],
        coach_sl: {
          name: "SL",
          displayNamePrefix: "S",
          bogiCount: getIntRandomNumber(8, 15),
          totalSeatCount: 72,
          seat_General: 58,
          seat_Tatkal: 7,
          seat_PremimuTatkal: 7,
        },
        coach_1a: {
          name: "1A",
          displayNamePrefix: "H",
          bogiCount: getIntRandomNumber(1, 2),
          totalSeatCount: 20,
          seat_General: 0,
          seat_Tatkal: 0,
          seat_PremimuTatkal: 0,
        },
        coach_2a: {
          name: "2A",
          displayNamePrefix: "A",
          bogiCount: getIntRandomNumber(2, 3),
          totalSeatCount: 46,
          seat_General: 30,
          seat_Tatkal: 8,
          seat_PremimuTatkal: 8,
        },
        coach_3a: {
          name: "3A",
          displayNamePrefix: "B",
          bogiCount: getIntRandomNumber(3, 4),
          totalSeatCount: 72,
          seat_General: 50,
          seat_Tatkal: 11,
          seat_PremimuTatkal: 11,
        },
        coach_cc: {
          name: "CC",
          displayNamePrefix: "C",
          bogiCount: getIntRandomNumber(1, 2),
          totalSeatCount: 94,
          seat_General: 50,
          seat_Tatkal: 22,
          seat_PremimuTatkal: 22,
        },
        coach_ec: {
          name: "EC",
          displayNamePrefix: "E",
          bogiCount: getIntRandomNumber(1, 2),
          totalSeatCount: 64,
          seat_General: 50,
          seat_Tatkal: 7,
          seat_PremimuTatkal: 7,
        },
      });
      await coachData_info.save();
    }
    res.status(200).json({ status: "Ok" });
  } catch (err) {
    res.status(502).json({ status: "Failed", message: err.message });
  }
});
dummyRouter.post("/seatallocation-to-60days-advance/test", async (req, res) => {
  try {
    seatAllocationData.collection.drop();
    const trainnumbers = await schedulesData.distinct("trainNumber");
    const today = new Date();

    // Loop for the next 60 days
    for (let i = 0; i <= 60; i++) {
      for (let j = 0; j < trainnumbers.length; j++) {
        console.log("processing day:", i, " & train:", trainnumbers[j]);
        const result_ofbogi = await coachData.findOne({
          trainNumber: trainnumbers[j],
        });
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        currentDate.setDate(today.getDate() + i);

        //sleeper
        let array_sl = [];
        let seqnum = 1;
        let bogino = 1;
        let seatno = 1;
        for (
          let k = 0;
          k <
          result_ofbogi.coach_sl.bogiCount *
            result_ofbogi.coach_sl.totalSeatCount;
          k++
        ) {
          if (result_ofbogi.coach_sl.totalSeatCount < seatno) {
            seatno = 1;
            bogino++;
          }
          array_sl.push({
            coachNumber: "S" + bogino,
            seatNo: seatno++,
            seatSequence: seqnum,
            reservationType: seatno > 65 ? 2 : seatno > 58 ? 1 : 0,
          });
          seqnum++;
        }
        //a3
        let array_a3 = [];
        seqnum = 1;
        bogino = 1;
        seatno = 1;
        for (
          let k = 0;
          k <
          result_ofbogi.coach_3a.bogiCount *
            result_ofbogi.coach_3a.totalSeatCount;
          k++
        ) {
          if (result_ofbogi.coach_3a.totalSeatCount < seatno) {
            seatno = 1;
            bogino++;
          }
          array_a3.push({
            coachNumber: "B" + bogino,
            seatNo: seatno++,
            seatSequence: seqnum,
            reservationType: seatno > 65 ? 2 : seatno > 58 ? 1 : 0,
          });
          seqnum++;
        }

        //a2
        let array_a2 = [];
        seqnum = 1;
        bogino = 1;
        seatno = 1;
        for (
          let k = 0;
          k <
          result_ofbogi.coach_2a.bogiCount *
            result_ofbogi.coach_2a.totalSeatCount;
          k++
        ) {
          if (result_ofbogi.coach_2a.totalSeatCount < seatno) {
            seatno = 1;
            bogino++;
          }
          array_a2.push({
            coachNumber: "A" + bogino,
            seatNo: seatno++,
            seatSequence: seqnum,
            reservationType: seatno > 30 ? 2 : seatno > 38 ? 1 : 0,
          });
          seqnum++;
        }
        //a1,
        let array_a1 = [];
        seqnum = 1;
        bogino = 1;
        seatno = 1;
        for (
          let k = 0;
          k <
          result_ofbogi.coach_1a.bogiCount *
            result_ofbogi.coach_1a.totalSeatCount;
          k++
        ) {
          if (result_ofbogi.coach_1a.totalSeatCount < seatno) {
            seatno = 1;
            bogino++;
          }
          array_a1.push({
            coachNumber: "H" + bogino,
            seatNo: seatno++,
            seatSequence: seqnum,
            reservationType: 0,
          });
          seqnum++;
        }
        //cc
        let array_cc = [];
        seqnum = 1;
        bogino = 1;
        seatno = 1;
        for (
          let k = 0;
          k <
          result_ofbogi.coach_cc.bogiCount *
            result_ofbogi.coach_cc.totalSeatCount;
          k++
        ) {
          if (result_ofbogi.coach_cc.totalSeatCount < seatno) {
            seatno = 1;
            bogino++;
          }
          array_cc.push({
            coachNumber: "C" + bogino,
            seatNo: seatno++,
            seatSequence: seqnum,
            reservationType: seatno > 50 ? 2 : seatno > 72 ? 1 : 0,
          });
          seqnum++;
        }
        //ec
        let array_ec = [];
        seqnum = 1;
        bogino = 1;
        seatno = 1;
        for (
          let k = 0;
          k <
          result_ofbogi.coach_ec.bogiCount *
            result_ofbogi.coach_ec.totalSeatCount;
          k++
        ) {
          if (result_ofbogi.coach_ec.totalSeatCount < seatno) {
            seatno = 1;
            bogino++;
          }
          array_ec.push({
            coachNumber: "E" + bogino,
            seatNo: seatno++,
            seatSequence: seqnum,
            reservationType: seatno > 50 ? 2 : seatno > 57 ? 1 : 0,
          });
          seqnum++;
        }
        const seats = {
          sl: array_sl,
          a1: array_a1,
          a2: array_a2,
          a3: array_a3,
          cc: array_cc,
          ec: array_ec,
        };
        const res = new seatAllocationData({
          trainNumber: trainnumbers[j],
          dateOfJourney: currentDate,
          seats: seats,
        });
        await res.save();
        //break;
      }
      //break;
    }
    res.status(200).json({ status: "Ok" });
  } catch (err) {
    res.status(502).json({ status: "Failed", message: err.message });
  }
});
// Helper functions
function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getPostgresType(value) {
  if (typeof value === "number") return "NUMERIC";
  if (typeof value === "boolean") return "BOOLEAN";
  return "TEXT";
}

function getTableName(filePath) {
  return filePath.replace(/^.*[\\\/]/, "").split(".")[0];
}

async function createTable(tableName, sampleObj) {
  const pool = await connectDB(); // get the pool instance
  const columns = Object.keys(sampleObj).map((key) => {
    const type = getPostgresType(sampleObj[key]);
    return `"${key}" ${type}`;
  });
  const query = `CREATE TABLE IF NOT EXISTS "${tableName}" (id SERIAL PRIMARY KEY, ${columns.join(
    ", "
  )})`;
  await pool.query(query);
}

async function insertData(tableName, data) {
  const pool = await connectDB(); // get the pool
  for (const row of data) {
    const keys = Object.keys(row);
    const values = Object.values(row);
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const query = `INSERT INTO "${tableName}" (${keys
      .map((k) => `"${k}"`)
      .join(", ")}) VALUES (${placeholders.join(", ")})`;
    await pool.query(query, values);
  }
}
dummyRouter.post("/schedules", async (req, res) => {
  try {
    const pool = await connectDB(); // get the pool instance
    const filePath = `C:\\Users\\shiva\\source\\repos\\json_files\\schedules.json`;
    const data = readJSON(filePath);
    await pool.query(
      "CREATE TABLE schedules (train_number VARCHAR(10) PRIMARY KEY,train_name VARCHAR(100) NOT NULL,station_from VARCHAR(10) NOT NULL,station_to VARCHAR(10) NOT NULL,train_runs_on_mon CHAR(1) NOT NULL,train_runs_on_tue CHAR(1) NOT NULL,train_runs_on_wed CHAR(1) NOT NULL,train_runs_on_thu CHAR(1) NOT NULL,train_runs_on_fri CHAR(1) NOT NULL,train_runs_on_sat CHAR(1) NOT NULL,train_runs_on_sun CHAR(1) NOT NULL,time_stamp TIMESTAMP NOT NULL);"
    );
    data.forEach(async (element) => {
      const query = `
INSERT INTO schedules (
    train_number, train_name, station_from, station_to,
    train_runs_on_mon, train_runs_on_tue, train_runs_on_wed, train_runs_on_thu,
    train_runs_on_fri, train_runs_on_sat, train_runs_on_sun, time_stamp
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
`;
      const values = [
        element.trainNumber,
        element.trainName,
        element.stationFrom,
        element.stationTo,
        element.trainRunsOnMon,
        element.trainRunsOnTue,
        element.trainRunsOnWed,
        element.trainRunsOnThu,
        element.trainRunsOnFri,
        element.trainRunsOnSat,
        element.trainRunsOnSun,
        element.timeStamp,
      ];
      await pool.query(query, values);
    });

    res.status(200).json({
      message: "ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
dummyRouter.post("/stationlist", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const client = pool.connect();
  try {
    const result = await pool.query("select *from schedules");
    const filePath = `C:\\Users\\shiva\\source\\repos\\json_files\\schedules.json`;
    const data = readJSON(filePath);
    await pool.query(
      `CREATE TABLE stationlist (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, station_code VARCHAR(10) NOT NULL, station_name VARCHAR(100), arrival_time TIME, departure_time TIME, route_number INT, halt_time INTERVAL, distance NUMERIC, day_count INT, stn_serial_number INT, boarding_disabled BOOLEAN, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);`
    );
    //await client.query("BEGIN");
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].stationList.length; j++) {
        await pool.query(
          "INSERT INTO stationlist (train_number, station_code, station_name, arrival_time, departure_time, route_number, halt_time, distance, day_count, stn_serial_number, boarding_disabled) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
          [
            data[i].trainNumber,
            data[i].stationList[j].stationCode,
            data[i].stationList[j].stationName,
            data[i].stationList[j].arrivalTime === "--"
              ? null
              : data[i].stationList[j].arrivalTime,
            data[i].stationList[j].departureTime === "--"
              ? null
              : data[i].stationList[j].departureTime,
            parseInt(data[i].stationList[j].routeNumber),
            data[i].stationList[j].haltTime === "--"
              ? null
              : data[i].stationList[j].haltTime,
            parseFloat(data[i].stationList[j].distance),
            parseInt(data[i].stationList[j].dayCount),
            parseInt(data[i].stationList[j].stnSerialNumber),
            data[i].stationList[j].boardingDisabled === "true",
          ]
        );
      }
    }

    //await client.query("COMMIT");
    res.status(200).json({
      message: "ok",
    });
  } catch (err) {
    //await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    //await client.query("RELEASE");
  }
});
dummyRouter.post("/coaches", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const filePath = `C:\\Users\\shiva\\source\\repos\\json_files\\coachdatas.json`;
  const data = readJSON(filePath);
  await pool.query("drop table coach_sl");
  await pool.query(
    `CREATE TABLE coach_sl (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, name VARCHAR(10) NOT NULL, display_name_prefix VARCHAR(5), bogi_count INT NOT NULL, total_seat_count INT NOT NULL, seat_general INT, seat_RAC INT, seat_tatkal INT, seat_premium_tatkal INT, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);`
  );
  await pool.query("drop table coach_a1");
  await pool.query(
    `CREATE TABLE coach_a1 (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, name VARCHAR(10) NOT NULL, display_name_prefix VARCHAR(5), bogi_count INT NOT NULL, total_seat_count INT NOT NULL, seat_general INT, seat_RAC INT, seat_tatkal INT, seat_premium_tatkal INT, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);`
  );
  await pool.query("drop table coach_a2");
  await pool.query(
    `CREATE TABLE  coach_a2 (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, name VARCHAR(10) NOT NULL, display_name_prefix VARCHAR(5), bogi_count INT NOT NULL, total_seat_count INT NOT NULL, seat_general INT, seat_RAC INT, seat_tatkal INT, seat_premium_tatkal INT, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);`
  );
  await pool.query("drop table coach_a3");
  await pool.query(
    `CREATE TABLE  coach_a3 (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, name VARCHAR(10) NOT NULL, display_name_prefix VARCHAR(5), bogi_count INT NOT NULL, total_seat_count INT NOT NULL, seat_general INT, seat_RAC INT, seat_tatkal INT, seat_premium_tatkal INT, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);`
  );
  await pool.query("drop table coach_cc");
  await pool.query(
    `CREATE TABLE  coach_cc (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, name VARCHAR(10) NOT NULL, display_name_prefix VARCHAR(5), bogi_count INT NOT NULL, total_seat_count INT NOT NULL, seat_general INT, seat_RAC INT, seat_tatkal INT, seat_premium_tatkal INT, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);`
  );
  await pool.query("drop table coach_ec");
  await pool.query(
    `CREATE TABLE coach_ec (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, name VARCHAR(10) NOT NULL, display_name_prefix VARCHAR(5), bogi_count INT NOT NULL, total_seat_count INT NOT NULL, seat_general INT, seat_RAC INT, seat_tatkal INT, seat_premium_tatkal INT, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);`
  );
  data.forEach(async (element) => {
    await pool.query(
      "INSERT INTO coach_sl (train_number, name, display_name_prefix, bogi_count, total_seat_count, seat_general, seat_RAC, seat_tatkal, seat_premium_tatkal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        element.trainNumber,
        element.coach_sl.name,
        element.coach_sl.displayNamePrefix,
        element.coach_sl.bogiCount,
        element.coach_sl.totalSeatCount,
        element.coach_sl.seat_General,
        element.coach_sl.seat_RAC,
        element.coach_sl.seat_Tatkal,
        element.coach_sl.seat_PremimuTatkal,
      ]
    );
    await pool.query(
      "INSERT INTO coach_a1 (train_number, name, display_name_prefix, bogi_count, total_seat_count, seat_general, seat_RAC, seat_tatkal, seat_premium_tatkal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        element.trainNumber,
        element.coach_1a.name,
        element.coach_1a.displayNamePrefix,
        element.coach_1a.bogiCount,
        element.coach_1a.totalSeatCount,
        element.coach_1a.seat_General,
        element.coach_1a.seat_RAC,
        element.coach_1a.seat_Tatkal,
        element.coach_1a.seat_PremimuTatkal,
      ]
    );
    await pool.query(
      "INSERT INTO coach_a2 (train_number, name, display_name_prefix, bogi_count, total_seat_count, seat_general, seat_RAC, seat_tatkal, seat_premium_tatkal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        element.trainNumber,
        element.coach_2a.name,
        element.coach_2a.displayNamePrefix,
        element.coach_2a.bogiCount,
        element.coach_2a.totalSeatCount,
        element.coach_2a.seat_General,
        element.coach_2a.seat_RAC,
        element.coach_2a.seat_Tatkal,
        element.coach_2a.seat_PremimuTatkal,
      ]
    );
    await pool.query(
      "INSERT INTO coach_a3 (train_number, name, display_name_prefix, bogi_count, total_seat_count, seat_general, seat_RAC, seat_tatkal, seat_premium_tatkal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        element.trainNumber,
        element.coach_3a.name,
        element.coach_3a.displayNamePrefix,
        element.coach_3a.bogiCount,
        element.coach_3a.totalSeatCount,
        element.coach_3a.seat_General,
        element.coach_3a.seat_RAC,
        element.coach_3a.seat_Tatkal,
        element.coach_3a.seat_PremimuTatkal,
      ]
    );
    await pool.query(
      "INSERT INTO coach_cc (train_number, name, display_name_prefix, bogi_count, total_seat_count, seat_general, seat_RAC, seat_tatkal, seat_premium_tatkal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        element.trainNumber,
        element.coach_cc.name,
        element.coach_cc.displayNamePrefix,
        element.coach_cc.bogiCount,
        element.coach_cc.totalSeatCount,
        element.coach_cc.seat_General,
        element.coach_cc.seat_RAC,
        element.coach_cc.seat_Tatkal,
        element.coach_cc.seat_PremimuTatkal,
      ]
    );
    await pool.query(
      "INSERT INTO coach_ec (train_number, name, display_name_prefix, bogi_count, total_seat_count, seat_general, seat_RAC, seat_tatkal, seat_premium_tatkal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        element.trainNumber,
        element.coach_ec.name,
        element.coach_ec.displayNamePrefix,
        element.coach_ec.bogiCount,
        element.coach_ec.totalSeatCount,
        element.coach_ec.seat_General,
        element.coach_ec.seat_RAC,
        element.coach_ec.seat_Tatkal,
        element.coach_ec.seat_PremimuTatkal,
      ]
    );
  });
});
dummyRouter.post("/seatallocation-based-on-dates", async (req, res) => {
  try {
    const pool = await connectDB(); // get the pool instance
    //creat table
    //await pool.query("drop table seatsOnDate");
    await pool.query(
      "CREATE TABLE IF NOT EXISTS seatsOnDate (id SERIAL PRIMARY KEY, train_number VARCHAR(10) NOT NULL, date_of_journey DATE NOT NULL, coach_sl TEXT, coach_1a TEXT, coach_2a TEXT, coach_3a TEXT, coach_cc TEXT, coach_ec TEXT, FOREIGN KEY (train_number) REFERENCES schedules(train_number) ON DELETE CASCADE);"
    );
    const result_trains = await pool.query(
      "select distinct train_number from schedules"
    );
    for (let a = 0; a < result_trains.rows.length; a++) {
      train_number = result_trains.rows[a].train_number;
      const result_seatcount_sl = await pool.query(
        "select * from coach_sl where train_number = $1",
        [train_number]
      );
      const result_seatcount_a1 = await pool.query(
        "select * from coach_a1 where train_number = $1",
        [train_number]
      );
      const result_seatcount_a2 = await pool.query(
        "select * from coach_a2 where train_number = $1",
        [train_number]
      );
      const result_seatcount_a3 = await pool.query(
        "select * from coach_a3 where train_number = $1",
        [train_number]
      );
      const result_seatcount_cc = await pool.query(
        "select * from coach_cc where train_number = $1",
        [train_number]
      );
      const result_seatcount_ec = await pool.query(
        "select * from coach_ec where train_number = $1",
        [train_number]
      );
      const today = new Date();
      //console.log(element.train_number);
      console.log("processing index:", a);
      for (let i = 1; i <= 60; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i); // start from tomorrow
        const formatted = d.toISOString().split("T")[0]; // YYYY-MM-DD
        const slString = getSLString(
          result_seatcount_sl.rows[0].display_name_prefix,
          result_seatcount_sl.rows[0].bogi_count,
          result_seatcount_sl.rows[0].total_seat_count,
          result_seatcount_sl.rows[0].seat_general,
          result_seatcount_sl.rows[0].seat_rac,
          result_seatcount_sl.rows[0].seat_tatkal,
          result_seatcount_sl.rows[0].seat_premium_tatkal
        );
        //a1
        const a1String = getSLString(
          result_seatcount_a1.rows[0].display_name_prefix,
          result_seatcount_a1.rows[0].bogi_count,
          result_seatcount_a1.rows[0].total_seat_count,
          result_seatcount_a1.rows[0].seat_general,
          result_seatcount_a1.rows[0].seat_rac,
          result_seatcount_a1.rows[0].seat_tatkal,
          result_seatcount_a1.rows[0].seat_premium_tatkal
        );
        //a2
        const a2String = getSLString(
          result_seatcount_a2.rows[0].display_name_prefix,
          result_seatcount_a2.rows[0].bogi_count,
          result_seatcount_a2.rows[0].total_seat_count,
          result_seatcount_a2.rows[0].seat_general,
          result_seatcount_a2.rows[0].seat_rac,
          result_seatcount_a2.rows[0].seat_tatkal,
          result_seatcount_a2.rows[0].seat_premium_tatkal
        );
        //a3
        const a3String = getSLString(
          result_seatcount_a3.rows[0].display_name_prefix,
          result_seatcount_a3.rows[0].bogi_count,
          result_seatcount_a3.rows[0].total_seat_count,
          result_seatcount_a3.rows[0].seat_general,
          result_seatcount_a3.rows[0].seat_rac,
          result_seatcount_a3.rows[0].seat_tatkal,
          result_seatcount_a3.rows[0].seat_premium_tatkal
        );
        //cc
        const ccString = getSLString(
          result_seatcount_cc.rows[0].display_name_prefix,
          result_seatcount_cc.rows[0].bogi_count,
          result_seatcount_cc.rows[0].total_seat_count,
          result_seatcount_cc.rows[0].seat_general,
          result_seatcount_cc.rows[0].seat_rac,
          result_seatcount_cc.rows[0].seat_tatkal,
          result_seatcount_cc.rows[0].seat_premium_tatkal
        );
        //ec
        const ecString = getSLString(
          result_seatcount_ec.rows[0].display_name_prefix,
          result_seatcount_ec.rows[0].bogi_count,
          result_seatcount_ec.rows[0].total_seat_count,
          result_seatcount_ec.rows[0].seat_general,
          result_seatcount_ec.rows[0].seat_rac,
          result_seatcount_ec.rows[0].seat_tatkal,
          result_seatcount_ec.rows[0].seat_premium_tatkal
        );
        //insert
        await pool.query(
          "INSERT INTO seatsOnDate (train_number, date_of_journey, coach_sl, coach_1a, coach_2a, coach_3a, coach_cc, coach_ec) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
          [
            train_number,
            formatted,
            slString,
            a1String,
            a2String,
            a3String,
            ccString,
            ecString,
          ]
        );
        d.setDate(today.getDate() + i);
        //break;
      }
      //break;
    }
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(200).json({ Error: err.message });
  }
});
dummyRouter.post("/pricelist", async (req, res) => {
  try {
    const pool = await connectDB(); // get the pool instance
    const filePath = `C:\\Users\\shiva\\source\\repos\\json_files\\pricelist.json`;
    const data = readJSON(filePath);
    await pool.query("drop table pricelist");
    await pool.query(
      "CREATE TABLE pricelist (pricelist_id SERIAL PRIMARY KEY, base_fare NUMERIC, reservation_charge NUMERIC, superfast_charge NUMERIC, fuel_amount NUMERIC, total_concession NUMERIC, tatkal_fare NUMERIC, service_tax NUMERIC, other_charge NUMERIC, catering_charge NUMERIC, dynamic_fare NUMERIC, total_fare NUMERIC, train_number VARCHAR(10) REFERENCES schedules(train_number), time_stamp TIME, from_stn_code VARCHAR(10), to_stn_code VARCHAR(10), class_code VARCHAR(10), distance INTEGER, duration INTEGER);"
    );
    data.forEach(async (element) => {
      const query = `INSERT INTO pricelist (base_fare, reservation_charge, superfast_charge, fuel_amount, total_concession, tatkal_fare, service_tax, other_charge, catering_charge, dynamic_fare, total_fare, train_number, time_stamp, from_stn_code, to_stn_code, class_code, distance, duration) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18);`;
      const values = [
        element.baseFare,
        element.reservationCharge,
        element.superfastCharge,
        element.fuelAmount,
        element.totalConcession,
        element.tatkalFare,
        element.serviceTax,
        element.otherCharge,
        element.cateringCharge,
        element.dynamicFare,
        element.totalFare,
        element.trainNumber,
        element.timeStamp,
        element.fromStnCode,
        element.toStnCode,
        element.classCode,
        element.distance,
        element.duration,
      ];
      await pool.query(query, values);
    });

    res.status(200).json({
      message: "ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
dummyRouter.post("/bookicket", async (req, res) => {
  try {
    const pool = await connectDB(); // get the pool instance
    //book one ticket
    let psdetails = "";
    await pool.query(
      "CREATE TABLE IF NOT EXISTS bookingData (id SERIAL PRIMARY KEY, train_number VARCHAR(20) NOT NULL, date_of_journey DATE NOT NULL, date_of_booking TIMESTAMP DEFAULT CURRENT_TIMESTAMP, passenger_details TEXT NOT NULL, source VARCHAR(100) NOT NULL, destination VARCHAR(100) NOT NULL, reservation_type VARCHAR(50) NOT NULL, coach_type VARCHAR(20) NOT NULL, aadhar_number VARCHAR(12), amount NUMERIC(10,2) NOT NULL, ipAddress INET NOT NULL, mobileNumber TEXT NOT NULL, user_id INT NOT NULL);"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS ticketData (id SERIAL PRIMARY KEY, booking_id INT REFERENCES bookingData(id) ON DELETE CASCADE, ticketdetails VARCHAR(255) NOT NULL, identifiationdetails VARCHAR(255) NOT NULL, arrival TIME, departure TIME, pnrStatus INT NOT NULL, pnr_number VARCHAR(20) NOT NULL);"
    );
    const userdata = await pool.query(
      "select *from users order by random() limit 1"
    );
    let passengercount = 0;
    req.body.passengerDetails.forEach((element) => {
      psdetails =
        psdetails +
        element.passengerName +
        "/" +
        element.gender +
        "/" +
        element.age +
        "/" +
        element.preferredBerth +
        "/" +
        element.isSeniorCitizen +
        "/" +
        element.isPhysicallyHandicapped +
        "@";
      passengercount++;
    });
    psdetails = psdetails.slice(0, -1);

    //explore to fetch seat details from string
    let gen_seatcount = 0;
    let seats = "";
    let updated_result = null;
    let ttk_seatcount = 0;
    let ptk_seatcount = 0;
    let result = null;
    let allocated_seatdetails = [];
    let initialallocated_seatdetails = [];
    for (p = 0; p < req.body.passengerDetails.length; p++) {
      switch (req.body.reservationType) {
        case "General":
          switch (req.body.coachType.toUpperCase()) {
            case "SL":
              result = await pool.query(
                "select coach_sl from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_sl;
              break;
            case "1A":
              result = await pool.query(
                "select coach_1a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_1a;
              break;
            case "2A":
              result = await pool.query(
                "select coach_2a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_2a;
              break;
            case "3A":
              result = await pool.query(
                "select coach_3a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_3a;
              break;
            case "CC":
              result = await pool.query(
                "select coach_cc from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_cc;
              break;
            case "EC":
              result = await pool.query(
                "select coach_ec from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_ec;
              break;
            default:
              break;
          }
          break;
        case "Tatkal":
          switch (req.body.coachType) {
            case "SL":
              let result = await pool.query(
                "select coach_sl from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              let seats = result.rows[0].coach_sl;
              break;
            case "1A":
              result = await pool.query(
                "select coach_1a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_1a;
              break;
            case "2A":
              result = await pool.query(
                "select coach_2a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_2a;
              break;
            case "3A":
              result = await pool.query(
                "select coach_3a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_3a;
              break;
            case "CC":
              result = await pool.query(
                "select coach_cc from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_cc;
              break;
            case "EC":
              result = await pool.query(
                "select coach_ec from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_ec;
              break;
            default:
              break;
          }
          break;
        case "Premium Tatkal":
          switch (req.body.coachType) {
            case "SL":
              let result = await pool.query(
                "select coach_sl from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              let seats = result.rows[0].coach_sl;
              break;
            case "1A":
              result = await pool.query(
                "select coach_1a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_1a;
              break;
            case "2A":
              result = await pool.query(
                "select coach_2a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_2a;
              break;
            case "3A":
              result = await pool.query(
                "select coach_3a from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_3a;
              break;
            case "CC":
              result = await pool.query(
                "select coach_cc from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_cc;
              break;
            case "EC":
              result = await pool.query(
                "select coach_ec from seatsondate where date_of_journey = $1 and train_number = $2;",
                [req.body.dateOfJourney, req.body.train_number]
              );
              seats = result.rows[0].coach_ec;
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      //FIRST CHECK IF SEAT AVAILABLE OTHERWISE RAC OTHERWISE WTL
      //seat count
      gen_availableseats = getAvailableSeatsCount("GNL", seats);
      rac_availableseats = getAvailableSeatsCount("RAC", seats);
      ttk_availableseats = getAvailableSeatsCount("TTK", seats);
      ptk_availableseats = getAvailableSeatsCount("PTK", seats);
      //assume only general for now
      //upate the full string

      //now replac the part of string to 'CNF' in main string
      let initialseat = gen_availableseats.seatdetails;
      let seatcurrent = "";
      let newseats = "";
      if (0 < gen_availableseats?.count) {
        //conf
        seatcurrent = initialseat?.replace("AVL", "CNF");
        allocated_seatdetails.push(seatcurrent + " (Confirmed)");
        initialallocated_seatdetails.push(gen_availableseats.initialseat);
        newseats = seats.replace(initialseat, seatcurrent);
      } else if (0 < rac_availableseats?.count) {
        //rac
        initialseat = rac_availableseats.seatdetails;
        seatcurrent = initialseat.replace("AVL", "RCNF");
        newseats = seats.replace(initialseat, seatcurrent);
        allocated_seatdetails.push(seatcurrent + " (RAC confirmed)");
        initialallocated_seatdetails.push(rac_availableseats.initialseat);
      } else {
        //waiting list
        let wlcount = getWaitingListCount(seats);
        wlcount = ++wlcount;
        let currwt = "@GEN/WLT" + wlcount;
        newseats = seats.concat(currwt);
        allocated_seatdetails.push(currwt);
        initialallocated_seatdetails.push("@");
      }
      switch (req.body.coachType) {
        case "SL":
          await pool.query(
            "update seatsondate set coach_sl = $1 where train_number = $2 and date_of_journey = $3",
            [newseats, req.body.train_number, req.body.dateOfJourney]
          );
          updated_result = await pool.query(
            "select coach_sl from seatsondate where date_of_journey = $1 and train_number = $2",
            [req.body.dateOfJourney, req.body.train_number]
          );
          break;
        case "1A":
          await pool.query(
            "update seatsondate set coach_1a = $1 where train_number = $2 and date_of_journey = $3",
            [newseats, req.body.train_number, req.body.dateOfJourney]
          );
          updated_result = await pool.query(
            "select coach_1a from seatsondate where date_of_journey = $1 and train_number = $2",
            [req.body.dateOfJourney, req.body.train_number]
          );
          break;
        case "2A":
          await pool.query(
            "update seatsondate set coach_2a = $1 where train_number = $2 and date_of_journey = $3",
            [newseats, req.body.train_number, req.body.dateOfJourney]
          );
          updated_result = await pool.query(
            "select coach_2a from seatsondate where date_of_journey = $1 and train_number = $2",
            [req.body.dateOfJourney, req.body.train_number]
          );
          break;
        case "3A":
          await pool.query(
            "update seatsondate set coach_3a = $1 where train_number = $2 and date_of_journey = $3",
            [newseats, req.body.train_number, req.body.dateOfJourney]
          );
          updated_result = await pool.query(
            "select coach_3a from seatsondate where date_of_journey = $1 and train_number = $2",
            [req.body.dateOfJourney, req.body.train_number]
          );
          break;
        case "CC":
          await pool.query(
            "update seatsondate set coach_cc = $1 where train_number = $2 and date_of_journey = $3",
            [newseats, req.body.train_number, req.body.dateOfJourney]
          );
          updated_result = await pool.query(
            "select coach_cc from seatsondate where date_of_journey = $1 and train_number = $2",
            [req.body.dateOfJourney, req.body.train_number]
          );
          break;
        case "EC":
          await pool.query(
            "update seatsondate set coach_ec = $1 where train_number = $2 and date_of_journey = $3",
            [newseats, req.body.train_number, req.body.dateOfJourney]
          );
          updated_result = await pool.query(
            "select coach_ec from seatsondate where date_of_journey = $1 and train_number = $2",
            [req.body.dateOfJourney, req.body.train_number]
          );
          break;
      }
    }
    const bookinginfo = await pool.query(
      "insert into bookingdata (train_number, date_of_journey, date_of_booking, passenger_details, source, destination, reservation_type, coach_type, aadhar_number, amount, ipAddress, mobilenumber, user_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
      [
        req.body.train_number,
        req.body.dateOfJourney,
        req.body.dateOfBooking,
        psdetails,
        req.body.source,
        req.body.destination,
        req.body.reservationType,
        req.body.coachType,
        req.body.aadhar,
        req.body.amount,
        req.body.ipAddress,
        req.body.mobileNumber,
        userdata.rows[0].user_id,
      ]
    );
    //confirm ticket & pnr
    const pnr = getPNR();
    const arr_dep_details = await pool.query(
      "SELECT * FROM stationlist where train_number = $1  and station_code = $2 ORDER BY stn_serial_number",
      [req.body.train_number, req.body.source]
    );
    const ticketresult = await pool.query(
      "INSERT INTO ticketData (booking_id, ticketdetails, identifiationdetails, arrival, departure, pnrStatus, pnr_number) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *",
      [
        bookinginfo.rows[0].id,
        allocated_seatdetails.join("@"),
        initialallocated_seatdetails.join("@"),
        arr_dep_details.rows[0].arrival_time,
        arr_dep_details.rows[0].departure_time,
        0,
        pnr,
      ]
    );
    //refine the data to give to user.
    const tarin_details = await pool.query(
      "select *from schedules where train_number = $1",
      [req.body.train_number]
    );
    //station
    const station_details = await pool.query(
      "select *from stations where code = $1 or code = $2",
      [req.body.source, req.body.destination]
    );
    //user
    const user_details = await pool.query(
      "select *from users where user_id = $1",
      [bookinginfo.rows[0].user_id]
    );
    const trainDetails = {
      trainNumber: tarin_details.rows[0].train_number,
      trainName: tarin_details.rows[0].train_name,
      scheduledDeparture: arr_dep_details.rows[0].departure_time,
      arrival: arr_dep_details.rows[0].arrival_time,
    };
    //journey details
    const journeyDetails = {
      source: station_details.rows[0].name,
      destination: station_details.rows[1].name,
      dateOfJourney: req.body.dateOfJourney,
      dateOfBooking: req.body.dateOfBooking,
      mobileNumber: req.body.mobileNumber,
    };
    //booking infor
    const bookingDetails = {
      bookedBy: user_details.rows[0].name,
      email: user_details.rows[0].email,
      mobile: user_details.rows[0].mobile,
    };
    let passengerDetails = [];
    let seat_allot = allocated_seatdetails;
    console.log(allocated_seatdetails);
    for (let i = 0; i < req.body.passengerDetails.length; i++) {
      passengerDetails.push({
        passengerName: req.body.passengerDetails[i].passengerName,
        gender: req.body.passengerDetails[i].gender,
        age: req.body.passengerDetails[i].age,
        coach: !seat_allot[i].includes("GEN/WLT")
          ? seat_allot[i].split("/")[0]
          : "-",
        berth: !seat_allot[i].includes("GEN/WLT")
          ? req.body.coachType === "1A"
            ? seat_allot[i].split("/")[2][0]
            : seat_allot[i].split("/")[2]
          : "-",
        seat: !seat_allot[i].includes("GEN/WLT")
          ? seat_allot[i].split("/")[1]
          : "-",
        status: !seat_allot[i].includes("GEN/WLT")
          ? seat_allot[i].split("/")[5]
          : allocated_seatdetails[i].replace("@GEN/", ""),
      });
    }
    const ticketDetails = {
      pnr: ticketresult.rows[0].pnr,
      reservationType: req.body.reservationType,
    };
    res.status(200).json({
      status: "Ok",
      data: {
        trainDetails,
        journeyDetails,
        passengerDetails,
        bookingDetails,
        ticketDetails,
      },
    });
  } catch (err) {
    res.status(200).json({ status: "Failed", message: err.message });
  }
});
dummyRouter.post("/ticketData", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  res.json({ status: "ok" });
});
dummyRouter.post("/reset-booking", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  await pool.query(
    `UPDATE seatsondate 
   SET coach_sl = REPLACE(coach_sl, $1, $2) 
   WHERE date_of_journey = $3 AND train_number = $4`,
    ["CNF", "AVL", req.body.dateOfJourney, req.body.train_number]
  );
  res.json({ status: "ok" });
});
dummyRouter.post("/fake-gen-filled", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  await pool.query(
    `UPDATE seatsondate 
   SET coach_sl = REPLACE(coach_sl, $1, $2) 
   WHERE date_of_journey = $3 AND train_number = $4`,
    ["AVL", "CNF", req.body.dateOfJourney, req.body.train_number]
  );
  res.json({ status: "ok" });
});
dummyRouter.post("/gen-list-cnf", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const result = await pool.query(
    "select coach_sl from seatsondate where train_number = $1 and date_of_journey=$2",
    [req.body.train_number, req.body.dateOfJourney]
  );
  //console.log(result.rows[0].coach_sl);
  const seats = getGenConfOnly(result.rows[0].coach_sl);
  await pool.query(
    "update seatsondate set coach_sl = $1 where train_number = $2 and date_of_journey=$3",
    [seats, req.body.train_number, req.body.dateOfJourney]
  );
  res.json({ status: "ok" });
});
dummyRouter.post("/cancelticket", async (req, res) => {
  const pool = await connectDB(); // get the pool instance
  const result = await pool.query(
    "select coach_sl from seatsondate where train_number = $1 and date_of_journey=$2",
    [req.body.train_number, req.body.dateOfJourney]
  );
  const seats = result.rows[0].coach_sl;
  rac_availableseats = getAvailableSeatsCount("RAC", seats);
  /*gen_availableseats = getAvailableSeatsCount("GNL", seats);
  rac_availableseats = getAvailableSeatsCount("RAC", seats);
  ttk_availableseats = getAvailableSeatsCount("TTK", seats);
  ptk_availableseats = getAvailableSeatsCount("PTK", seats);*/
  //console.log(rac_availableseats);
  gen_availableseats = getAvailableSeatsCount("GNL", seats);
  res.json({ status: "Ok", data: { rac_availableseats, gen_availableseats } });
});

//cron job
cron.schedule("0 25 18 * * *", () => {
  console.log("first schedula job!");
  mycheduledTask();
});
function mycheduledTask() {
  console.log("this is executed!");
}
module.exports = dummyRouter;
