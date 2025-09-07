const is_RAC_SeatsAvailable = (seatString) => {
  let result = seatString.split("@").filter((item) => item.endsWith("RAC"));
  return 0 < result.length;
};
module.exports = is_RAC_SeatsAvailable;
