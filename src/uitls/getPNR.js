const getPNR = () => {
  // Typical Indian Railways PNR is 10 digits
  let digits = "";
  for (let i = 0; i < 10; i++) {
    digits += Math.floor(Math.random() * 10); // random digit 0-9
  }
  return digits;
};
module.exports = getPNR;
