const { connectDB } = require("../database/connectDB");
const cron = require("node-cron");
cron.schedule("*/1 * * * *", async () => {
  // await newSeatAllocationCron();
  const pool = await connectDB(); // get the pool instance
  const client = await pool.connect();
  await checkAndExpireTicket(client);
});
const checkAndExpireTicket = async (client) => {
  try {
    const result_active_pnrs = await client.query(
      "select pnr from ticketdata where pnrstatus=$1",
      [0]
    );
    //first for each ticket, get the arrival time of that train for that specified destination mentioned in ticket
    await client.query("BEGIN");
    for (let i = 0; i < result_active_pnrs.rows.length; i++) {
      const reslt_fulldetails = await client.query(
        `SELECT t.id, t.pnr, j.train_number, s.arrival, s.running_day FROM ticketdata t join journeyplandata j on t.fkjourneyplandata = j.id
join schedules s on j.train_number = s.train_number 
where s.train_number = j.train_number and
s.station_code = j.destination_code and
t.pnr = $1;`,
        [result_active_pnrs.rows[i].pnr]
      );
      const status = checkArrivalIST(reslt_fulldetails.rows[0].arrival);
      if (status) {
        //update pnrstatus=2 (which is expired automatically)
        await client.query(
          "update ticketdata set pnrstatus=$1 where pnr = $2",
          [2, result_active_pnrs.rows[i].pnr]
        );
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    console.log("Error while cron: Error", err.message);
    client.query("ROLLBACK");
  } finally {
    await client.release();
  }
};
const newSeatAllocationCron = async () => {
  const pool = await connectDB(); // get the pool instance
  const result_trains = await pool.query(
    "select distinct train_number from schedules"
  );
  const today = new Date();
  const d = new Date(today);
  d.setDate(today.getDate() + 61); // start from tomorrow
  const formatted = d.toISOString().split("T")[0]; // YYYY-MM-DD
  for (let a = 0; a < result_trains.rows.length; a++) {
    train_number = result_trains.rows[a].train_number;
    const result_seatcount_sl = await pool.query(
      "select * from coach_sl where train_number = $1",
      [train_number]
    );
    const result_seatcount_a1 = await pool.query(
      "select * from coach_a1 where train_number = $1",
      [train_number]
    );
    const result_seatcount_a2 = await pool.query(
      "select * from coach_a2 where train_number = $1",
      [train_number]
    );
    const result_seatcount_a3 = await pool.query(
      "select * from coach_a3 where train_number = $1",
      [train_number]
    );
    const result_seatcount_cc = await pool.query(
      "select * from coach_cc where train_number = $1",
      [train_number]
    );
    const result_seatcount_ec = await pool.query(
      "select * from coach_ec where train_number = $1",
      [train_number]
    );
    const slString = getSLString(
      result_seatcount_sl.rows[0].display_name_prefix,
      result_seatcount_sl.rows[0].bogi_count,
      result_seatcount_sl.rows[0].total_seat_count,
      result_seatcount_sl.rows[0].seat_general,
      result_seatcount_sl.rows[0].seat_rac,
      result_seatcount_sl.rows[0].seat_tatkal,
      result_seatcount_sl.rows[0].seat_premium_tatkal
    );
    //a1
    const a1String = getSLString(
      result_seatcount_a1.rows[0].display_name_prefix,
      result_seatcount_a1.rows[0].bogi_count,
      result_seatcount_a1.rows[0].total_seat_count,
      result_seatcount_a1.rows[0].seat_general,
      result_seatcount_a1.rows[0].seat_rac,
      result_seatcount_a1.rows[0].seat_tatkal,
      result_seatcount_a1.rows[0].seat_premium_tatkal
    );
    //a2
    const a2String = getSLString(
      result_seatcount_a2.rows[0].display_name_prefix,
      result_seatcount_a2.rows[0].bogi_count,
      result_seatcount_a2.rows[0].total_seat_count,
      result_seatcount_a2.rows[0].seat_general,
      result_seatcount_a2.rows[0].seat_rac,
      result_seatcount_a2.rows[0].seat_tatkal,
      result_seatcount_a2.rows[0].seat_premium_tatkal
    );
    //a3
    const a3String = getSLString(
      result_seatcount_a3.rows[0].display_name_prefix,
      result_seatcount_a3.rows[0].bogi_count,
      result_seatcount_a3.rows[0].total_seat_count,
      result_seatcount_a3.rows[0].seat_general,
      result_seatcount_a3.rows[0].seat_rac,
      result_seatcount_a3.rows[0].seat_tatkal,
      result_seatcount_a3.rows[0].seat_premium_tatkal
    );
    //cc
    const ccString = getSLString(
      result_seatcount_cc.rows[0].display_name_prefix,
      result_seatcount_cc.rows[0].bogi_count,
      result_seatcount_cc.rows[0].total_seat_count,
      result_seatcount_cc.rows[0].seat_general,
      result_seatcount_cc.rows[0].seat_rac,
      result_seatcount_cc.rows[0].seat_tatkal,
      result_seatcount_cc.rows[0].seat_premium_tatkal
    );
    //ec
    const ecString = getSLString(
      result_seatcount_ec.rows[0].display_name_prefix,
      result_seatcount_ec.rows[0].bogi_count,
      result_seatcount_ec.rows[0].total_seat_count,
      result_seatcount_ec.rows[0].seat_general,
      result_seatcount_ec.rows[0].seat_rac,
      result_seatcount_ec.rows[0].seat_tatkal,
      result_seatcount_ec.rows[0].seat_premium_tatkal
    );
    //insert
    await pool.query(
      "INSERT INTO seatsOnDate (train_number, date_of_journey, coach_sl, coach_1a, coach_2a, coach_3a, coach_cc, coach_ec) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        train_number,
        formatted,
        slString,
        a1String,
        a2String,
        a3String,
        ccString,
        ecString,
      ]
    );
  }
};

const prepareChartForAllTrains = async () => {
  const pool = await connectDB(); // get the pool instance
  //remember make pnrstatus=1 when chart prepared
  //once chart prepared, if ticketare in waiting list-> auto refund initiate( just display the amt refund aste)
  //update the seats
};
function getCurrentIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
  return new Date(now.getTime() + istOffset);
}

function checkArrivalIST(arrivalTime) {
  // arrivalTime = "20:22:00" from PostgreSQL
  const [h, m, s] = arrivalTime.split(":").map(Number);

  // Current IST
  let nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  // Build today’s IST with arrival time
  let arrivalIST = new Date(nowIST);
  arrivalIST.setHours(h, m, s || 0, 0);
  arrivalIST.setMinutes(arrivalIST.getMinutes() + 29);
  arrivalIST = arrivalIST.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  nowIST = nowIST.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  if (arrivalIST <= nowIST) {
    return true;
  } else {
    return false;
  }
}
