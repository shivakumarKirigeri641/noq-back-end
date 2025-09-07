const { connectDB } = require("../database/connectDB");
const cron = require("node-cron");
cron.schedule("0 0 0 * * *", async () => {
  console.log("first schedula job!");
  await newSeatAllocationCron();
});
const newSeatAllocationCron = async () => {
  const pool = await connectDB(); // get the pool instance
  const result_trains = await pool.query(
    "select distinct train_number from schedules"
  );
  const today = new Date();
  const d = new Date(today);
  d.setDate(today.getDate() + 61); // start from tomorrow
  const formatted = d.toISOString().split("T")[0]; // YYYY-MM-DD
  console.log(formatted); //nov 6
  for (let a = 0; a < result_trains.rows.length; a++) {
    train_number = result_trains.rows[a].train_number;
    console.log("inserting new seats for:", train_number);
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
