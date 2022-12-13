const { db, execQuery } = require("./db");

async function seedDatabase(moneyOutId, moneyInId, moneySum) {
  db.connect();

  try {
    const resultOut = await execQuery(
      "Select balance from account WHERE account_number = ?",
      [moneyOutId]
    );
    const moneyOut = JSON.parse(JSON.stringify(resultOut));
    const outPocket = moneyOut[0].balance;
    const resultIn = await execQuery(
      "Select balance from account WHERE account_number = ?",
      [moneyInId]
    );
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

    await execQuery("UPDATE account SET balance = ? WHERE account_number = ?", [
      outBalance,
      moneyOutId,
    ]);
    await execQuery("UPDATE account SET balance = ? WHERE account_number = ?", [
      inBalance,
      moneyInId,
    ]);

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
