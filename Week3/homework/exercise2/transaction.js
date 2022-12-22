const { db, execQuery } = require("./db");

const balanceFromPickedAccount = `SELECT balance FROM account WHERE account_number = ?`;
const arrangedUpdatingPickedAccount = `UPDATE account SET balance = ? WHERE account_number = ?`;

async function seedDatabase(moneyOutId, moneyInId, moneySum) {
  db.connect();

  try {
    const resultOut = await execQuery(balanceFromPickedAccount, [moneyOutId]);
    const moneyOut = JSON.parse(JSON.stringify(resultOut));
    const outPocket = moneyOut[0].balance;
    const resultIn = await execQuery(balanceFromPickedAccount, [moneyInId]);
    const moneyIn = JSON.parse(JSON.stringify(resultIn));
    const inPocket = moneyIn[0].balance;
    const outBalance = outPocket - moneySum;
    const inBalance = inPocket + moneySum;
    newChanges = [
      [moneyOutId, outBalance, new Date(), `You have transferred ${moneySum}`],
      [
        moneyInId,
        inBalance,
        new Date(),
        `${moneySum} was transferred to your account`,
      ],
    ];

    await execQuery("START TRANSACTION");

    await execQuery(arrangedUpdatingPickedAccount, [outBalance, moneyOutId]);
    await execQuery(arrangedUpdatingPickedAccount, [inBalance, moneyInId]);

    await execQuery(
      "INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES ?",
      [newChanges]
    );

    await execQuery("COMMIT");
  } catch (error) {
    console.error(error);
    await execQuery("ROLLBACK");
  }

  db.end();
}

seedDatabase(101, 102, 1000);
