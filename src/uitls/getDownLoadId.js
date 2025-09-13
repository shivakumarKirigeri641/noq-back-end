const getDownLoadId = (listOfdownloadIds, prefix = "") => {
  const pnr = null;
  for (;;) {
    generatePNR = (prefix = "") =>
      prefix + crypto.randomBytes(8).toString("hex");
    if (!listOfPnrs.includes(generatePNR)) {
      pnr = generatePNR;
      break;
    }
  }
  //get pnr distinct
  return pnr;
};
module.exports = getDownLoadId;
