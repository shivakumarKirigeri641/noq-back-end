const is_Gen_SeatsAvailable = (seatString) => {
  let result = seatString.split("@").filter((item) => item.endsWith("AVL"));
  return 0 < result.length;
};
module.exports = is_Gen_SeatsAvailable;
