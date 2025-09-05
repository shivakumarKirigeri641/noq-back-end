const getExpiryDate = () => {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setHours(23, 59, 59, 0); // today 23:59:59
  return expiry;
};
module.exports = getExpiryDate;
