const is_Tatkal_SeatsAvailable = (seatString) => {
  let result = seatString.split("@").filter((item) => item.includes("/TTK/"));
  return 0 < result.length;
};
module.exports = is_Tatkal_SeatsAvailable;
