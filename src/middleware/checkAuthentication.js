const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkAuthentication = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(200)
      .json({ status: "Failed", message: "Session expired!" });
  }
  try {
    const result = await jwt.verify(token, process.env.SECRET_KEY);
    if (!result) {
      1;
      return res
        .status(200)
        .json({ status: "Failed", message: "Invalid session!" });
    }
    req.mobile_number = result.mobile_number;
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
module.exports = checkAuthentication;
