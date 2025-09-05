const getPNR = (listOfPnrs) => {
  const pnr = null;
  for (;;) {
    generatePNR = () =>
      Math.floor(1000000000 + Math.random() * 9000000000).toString();
    if (!listOfPnrs.includes(generatePNR)) {
      pnr = generatePNR;
      break;
    }
  }
  //get pnr distinct
  return pnr;
};
module.exports = getPNR;
