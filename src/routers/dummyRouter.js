const express = require("express");
const priceData = require("../models/priceData");
const schedulesData = require("../models/schedulesData");
const coachData = require("../models/coachData");
const checkAuthentication = require("../middleware/checkAuthentication");
require("dotenv").config();
const dummyRouter = express.Router();
const jwt = require("jsonwebtoken");
const getIntRandomNumber = require("../uitls/getIntRandomNumber");
const seatAllocationData = require("../models/seatAllocationsData");
dummyRouter.post("/test", async (req, res) => {
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
          seatPercent_General: 58,
          seatPercent_Tatkal: 7,
          seatPercent_PremimuTatkal: 7,
        },
        coach_1a: {
          name: "1A",
          displayNamePrefix: "H",
          bogiCount: getIntRandomNumber(1, 2),
          totalSeatCount: 20,
          seatPercent_General: 0,
          seatPercent_Tatkal: 0,
          seatPercent_PremimuTatkal: 0,
        },
        coach_2a: {
          name: "2A",
          displayNamePrefix: "A",
          bogiCount: getIntRandomNumber(2, 3),
          totalSeatCount: 46,
          seatPercent_General: 30,
          seatPercent_Tatkal: 8,
          seatPercent_PremimuTatkal: 8,
        },
        coach_3a: {
          name: "3A",
          displayNamePrefix: "B",
          bogiCount: getIntRandomNumber(3, 4),
          totalSeatCount: 72,
          seatPercent_General: 50,
          seatPercent_Tatkal: 11,
          seatPercent_PremimuTatkal: 11,
        },
        coach_cc: {
          name: "CC",
          displayNamePrefix: "C",
          bogiCount: getIntRandomNumber(1, 2),
          totalSeatCount: 94,
          seatPercent_General: 50,
          seatPercent_Tatkal: 22,
          seatPercent_PremimuTatkal: 22,
        },
        coach_ec: {
          name: "EC",
          displayNamePrefix: "E",
          bogiCount: getIntRandomNumber(1, 2),
          totalSeatCount: 64,
          seatPercent_General: 50,
          seatPercent_Tatkal: 7,
          seatPercent_PremimuTatkal: 7,
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
module.exports = dummyRouter;
