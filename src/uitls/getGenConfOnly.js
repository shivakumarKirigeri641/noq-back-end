const getGenConfOnly = (seatString) => {
  // Split by '@'
  let parts = seatString.split("@");

  // Replace only if segment contains "GNL"
  let updated = parts.map((p) => {
    if (p.includes("GNL")) {
      return p.replace("/AVL", "/CNF"); // only last AVL changes
      //return p.replace("/CNF", "/AVL"); // only last AVL changes
    }
    return p;
  });

  // Join back
  let finalStr = updated.join("@");
  return finalStr;
};
module.exports = getGenConfOnly;
