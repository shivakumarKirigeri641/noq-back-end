const getSLString = (
  coachprefix,
  bogicount,
  totalseatcount,
  generalseatcount,
  racseatcount,
  tatkalcount,
  premiumtatkalcount
) => {
  let seatno = 1;
  let actString = "";
  let reservationtype = "GN";
  let seatStatus = "AVL";
  let bogino = 1;
  let seatcount = 1;
  for (let i = 1; i <= bogicount * totalseatcount; i++) {
    reservationtype = "GNL";
    if (seatcount > totalseatcount) {
      seatno = 1;
      bogino++;
      seatcount = 1;
      reservationtype = "GNL";
    }
    if (seatno > generalseatcount + racseatcount + tatkalcount) {
      reservationtype = "PTK";
    } else if (seatno > generalseatcount + racseatcount) {
      reservationtype = "TTK";
    } else if (seatno > generalseatcount) {
      reservationtype = "RAC";
    }
    actString =
      actString +
      coachprefix +
      bogino +
      "/" +
      seatcount +
      "/" +
      getBerth(seatcount, totalseatcount, coachprefix) +
      "/" +
      i +
      "/" +
      reservationtype +
      "/" +
      seatStatus +
      "@";
    seatno++;
    seatcount++;
  }
  actString = actString.slice(0, -1);
  return actString;
};
const getBerth = (seatno, totalseatcount, coachprefix) => {
  let berth = null;
  let num = 1;
  let addThree = true;
  switch (coachprefix) {
    case "B":
    case "S":
      //lb
      num = 1;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "LB";
          break;
        }
        num += addThree ? 3 : 5; // alternate +3 and +5
        addThree = !addThree;
      }
      //mb
      num = 2;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "MB";
          break;
        }
        num += addThree ? 3 : 5; // alternate +3 and +5
        addThree = !addThree;
      }
      //ub
      num = 3;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "UB";
          break;
        }
        num += addThree ? 3 : 5; // alternate +3 and +5
        addThree = !addThree;
      }
      //SL
      num = 7;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "SL";
          break;
        }
        num += 8;
      }
      //SU
      num = 8;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "SU";
          break;
        }
        num += 8;
      }
      break;
    case "A":
      //lb
      num = 1;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "LB";
          break;
        }
        num += addThree ? 2 : 4; // alternate +3 and +5
        addThree = !addThree;
      }
      //ub
      num = 2;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "UB";
          break;
        }
        num += addThree ? 2 : 4; // alternate +3 and +5
        addThree = !addThree;
      }
      //ub
      num = 2;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "UB";
          break;
        }
        num += addThree ? 2 : 4; // alternate +3 and +5
        addThree = !addThree;
      }
      //sl
      num = 5;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "SL";
          break;
        }
        num += 6;
      }
      //su
      num = 6;
      addThree = true;
      while (!berth && num <= totalseatcount) {
        if (num === seatno) {
          berth = "SU";
          break;
        }
        num += 6;
      }
      break;
    case "H":
      const groups = { a: 4, b: 4, c: 2, d: 2, e: 2, f: 4, g: 4 };
      let index = 1;
      let exit = false;
      for (const key of Object.keys(groups)) {
        for (let i = 1; i <= groups[key]; i++) {
          if (index === seatno) {
            exit = true;
            berth = `${key.toUpperCase()}${i}`;
            break;
          }
          index++;
        }
        if (exit) {
          break;
        }
      }
      break;
    case "C":
      const mod = seatno % 8;
      if (mod === 1 || mod === 4) berth = "WS"; // Window
      if (mod === 2 || mod === 6) berth = "MS"; // Middle
      if (mod === 3 || mod === 5 || mod === 7) berth = "AS"; // Aisle
      if (mod === 0) berth = "WS"; // Seat 8,16,24... are Window
      break;
    case "E":
      const wsSeats = new Set([
        1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30, 33, 34, 37,
        38, 41, 42, 45, 46,
      ]);
      if (wsSeats.has(seatno)) {
        berth = "WS";
      } else {
        berth = "AS";
      }
      break;
    default:
      break;
  }
  return berth;
};
module.exports = getSLString;
