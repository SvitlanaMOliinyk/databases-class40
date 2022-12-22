const { db, execQuery } = require("./db");

let rows = [];
for (i = 1; i <= 500; i++) {
  const randomAccountBalance = (Math.random() * 100000.0).toFixed(2);
  rows.push([randomAccountBalance]);
}

let changedAccount = [];
for (i = 1; i <= 3; i++) {
  const randomBalanceChange = (Math.random() * 100000.0).toFixed(2);
  changedAccount.push([
    i,
    randomBalanceChange,
    new Date(),
    `Transaction successfully completed`,
  ]);
}

const preparedAccountInsert = `INSERT INTO account(balance) VALUES ?`;
const preparedAccountChangesInsert = `INSERT INTO account_changes(account_number, amount, changed_date, remark) VALUES ?`;

async function seedDatabase() {
  db.connect();
  try {
    await execQuery(preparedAccountInsert, [rows]);
    await execQuery(preparedAccountChangesInsert, [changedAccount]);
  } catch (err) {
    console.error(err.message);
  }
  db.end();
}
seedDatabase();
