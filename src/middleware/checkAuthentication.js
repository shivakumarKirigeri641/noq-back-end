const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkAuthentication = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(200).json({ status: "Failed", message: "Session expired!" });
    return;
  }
  const result = await jwt.verify(token, process.env.SECRET_KEY);
  const keytext = process.env.SECRET_PAYLOAD;
  if (!result) {
    1;
    res.status(200).json({ status: "Failed", message: "Invalid session!" });
    return;
  }
  next();
};
module.exports = checkAuthentication;
