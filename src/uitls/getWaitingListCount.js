const getWaitingListCount = (seatString) => {
  let result = seatString
    .split("@")
    .filter((item) => item.startsWith("GEN/WLT"));
  return result.length;
};
module.exports = getWaitingListCount;
