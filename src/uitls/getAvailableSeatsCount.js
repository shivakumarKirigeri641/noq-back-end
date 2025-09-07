const getAvailableSeatsCount = (seatString) => {
  let result = seatString.split("@").filter((item) => item.endsWith("AVL"));
  return result.length;
};
module.exports = getAvailableSeatsCount;
