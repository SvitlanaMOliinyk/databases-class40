const { db, execQuery } = require("./db");

let rows = [];
for (i = 1; i <= 500; i++) {
    const randomNum = (Math.random() * 100000.0).toFixed(2);
  rows.push([randomNum]);
}

let changedAccount = [];
for (i = 1; i <= 3; i++) {
    const randomNum = (Math.random() * 100000.0).toFixed(2);
    changedAccount.push([i, randomNum, new Date(), `Transaction successfully completed`]);
  }

async function seedDatabase() {
    db.connect();
  try {
    await execQuery("INSERT INTO account(balance) VALUES ?", [rows]);
    await execQuery(
      "INSERT INTO account_changes(account_number, amount, changed_date, remark) VALUES ?",
      [changedAccount]
    );
    db.end();
  } catch (err) {
    console.error(err.message);
    db.end();
  }
}
seedDatabase();
