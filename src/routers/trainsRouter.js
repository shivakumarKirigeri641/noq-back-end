const express = require("express");
const priceData = require("../models/priceData");
const getWeekDayNameInShort = require("../uitls/getWeekDayNameInShort");
const checkAuthentication = require("../middleware/checkAuthentication");
const trainsRouter = express.Router();
const stationsData = require("../models/stationsData");
const schedulesData = require("../models/schedulesData");
//get trains based on src & dest provided with date (on clicking on search)
trainsRouter.post(
  "/noq/noqunreservedticket/:sourceCode/:destinationCode/:journeyDate",
  checkAuthentication,
  async (req, res) => {
    try {
      const { sourceCode, destinationCode, journeyDate } = req?.params;
      if (!sourceCode) {
        throw new Error("Invalid inputs!");
      }
      if (!destinationCode) {
        throw new Error("Invalid inputs!");
      }
      if (!journeyDate) {
        throw new Error("Invalid inputs!");
      }
      const dayname = getWeekDayNameInShort(new Date(journeyDate));
      let data = null;
      switch (dayname) {
        case "Mon":
          data = await schedulesData.find({
            $and: [
              {
                "stationList.stationCode": sourceCode.toUpperCase(),
              },
              {
                "stationList.stationCode": destinationCode.toUpperCase(),
              },
              {
                trainRunsOnMon: "Y",
              },
            ],
          });
          break;
        case "Tue":
          data = await schedulesData.find({
            $and: [
              {
                "stationList.stationCode": sourceCode.toUpperCase(),
              },
              {
                "stationList.stationCode": destinationCode.toUpperCase(),
              },
              {
                trainRunsOnTue: "Y",
              },
            ],
          });
          break;
        case "Wed":
          data = await schedulesData.find({
            $and: [
              {
                "stationList.stationCode": sourceCode.toUpperCase(),
              },
              {
                "stationList.stationCode": destinationCode.toUpperCase(),
              },
              {
                trainRunsOnWed: "Y",
              },
            ],
          });
          break;
        case "Thu":
          data = await schedulesData.find({
            $and: [
              {
                "stationList.stationCode": sourceCode.toUpperCase(),
              },
              {
                "stationList.stationCode": destinationCode.toUpperCase(),
              },
              {
                trainRunsOnThu: "Y",
              },
            ],
          });
          break;
        case "Fri":
          data = await schedulesData.find({
            $and: [
              {
                "stationList.stationCode": sourceCode.toUpperCase(),
              },
              {
                "stationList.stationCode": destinationCode.toUpperCase(),
              },
              {
                trainRunsOnFri: "Y",
              },
            ],
          });
          break;
        case "Sat":
          data = await schedulesData.find({
            $and: [
              {
                "stationList.stationCode": sourceCode.toUpperCase(),
              },
              {
                "stationList.stationCode": destinationCode.toUpperCase(),
              },
              {
                trainRunsOnSat: "Y",
              },
            ],
          });
          break;
        case "Sun":
          data = await schedulesData.find({
            $and: [
              {
                "stationList.stationCode": sourceCode.toUpperCase(),
              },
              {
                "stationList.stationCode": destinationCode.toUpperCase(),
              },
              {
                trainRunsOnSun: "Y",
              },
            ],
          });
          break;
      }
      let result = [];
      //src stnSerialNumber must be less, take only those trains
      for (let i = 0; i < data.length; i++) {
        let fromserialcode = 0;
        let toserialcode = 0;
        let fromserialcodefound = false;
        let toserialcodefound = false;

        //ist in string, stserialcode, cnvrt to number pls
        for (let j = 0; j < data[i].stationList.length; j++) {
          if (
            data[i].stationList[j].stationCode.toUpperCase() ===
            sourceCode.toUpperCase()
          ) {
            fromserialcode = Number.parseInt(
              data[i].stationList[j].stnSerialNumber
            );
            fromserialcodefound = true;
          }
          if (
            data[i].stationList[j].stationCode.toUpperCase() ===
            destinationCode.toUpperCase()
          ) {
            toserialcode = Number.parseInt(
              data[i].stationList[j].stnSerialNumber
            );
            toserialcodefound = true;
          }
          if (fromserialcodefound && toserialcodefound) {
            break;
          }
        }
        if (fromserialcode < toserialcode) {
          //get price deatils
          const priceDetails = await priceData.find({
            $and: [
              { trainNumber: data[i]?.trainNumber },
              { fromStnCode: sourceCode.toUpperCase() },
              { toStnCode: destinationCode.toUpperCase() },
              { classCode: "SL" }, //FOR TIME BEING fetch only sleeper class as we don't have actual api
            ],
          });
          result.push({
            traindDetails: data[i],
            priceDetails,
          });
        }
      }
      res.status(200).json({ status: "STATUS_OK", result });
    } catch (err) {
      res.send("errlr" + err.message);
    }
  }
);
module.exports = trainsRouter;
