const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkTTAuthentication = async (req, res, next) => {
  // Allow preflight to pass without authentication
  if (req.method === "OPTIONS") return res.sendStatus(200);
  const { ttid } = req.cookies;
  if (!ttid) {
    return res
      .status(200)
      .json({ status: "Failed", message: "Session expired!" });
  }
  try {
    const result = await jwt.verify(ttid, process.env.SECRET_KEY);
    if (!result) {
      1;
      return res
        .status(200)
        .json({ status: "Failed", message: "Invalid session!" });
    }
    req.ttid = result.ttid;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(200)
        .json({ status: "Failed", message: "token expired!" });
    } else {
      return res
        .status(200)
        .json({ status: "Failed", message: "token invalid!" });
    }
  }
  const keytext = process.env.SECRET_PAYLOAD;
  next();
};
module.exports = checkTTAuthentication;
