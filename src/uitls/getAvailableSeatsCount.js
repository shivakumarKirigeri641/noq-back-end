const getAvailableSeatsCount = (quota, seatString) => {
  let result = seatString
    .split("@")
    .filter((item) => item.includes("/" + quota.toUpperCase() + "/AVL"));
  console.log(result);
  return result.length;
};
module.exports = getAvailableSeatsCount;
