const getAvailableSeatsCount = (quota, seatString) => {
  let result = seatString
    .split("@")
    .filter((item) => item.includes("/" + quota.toUpperCase() + "/AVL"));
  return { seatdetails: result[0], count: result.length };
};
module.exports = getAvailableSeatsCount;
