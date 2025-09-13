const is_Premium_Tatkal_SeatsAvailable = (seatString) => {
  let result = seatString.split("@").filter((item) => item.includes("/PTK/"));
  return 0 < result.length;
};
module.exports = is_Premium_Tatkal_SeatsAvailable;
