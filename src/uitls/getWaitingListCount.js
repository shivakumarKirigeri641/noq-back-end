const getWaitingListCount = (seatString) => {
  let result = seatString.split("@").filter((item) => item.endsWith("WLT"));
  return result.length;
};
module.exports = getWaitingListCount;
