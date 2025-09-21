const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkAuthentication = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    console.log("token:", token);
    if (!token) {
      throw new Error("Session expired");
    }
    try {
      const result = await jwt.verify(token, process.env.SECRET_KEY);
      if (!result) {
        throw new Error("Session expired");
      }
      req.mobile_number = result.mobile_number;
    } catch (err) {
      throw new Error("Session expired");
    }
    const keytext = process.env.SECRET_PAYLOAD;
    next();
  } catch (err) {
    return res.status(401).json({ status: "Failed", message: err.message });
  }
};
module.exports = checkAuthentication;
