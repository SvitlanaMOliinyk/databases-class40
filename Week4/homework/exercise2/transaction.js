const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main() {
  if (process.env.MONGODB_URI == null) {
    throw Error(`You did not set up the environment variables correctly.`);
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    await transferAmount(client, 101, 102, 1000);
    // await getChangedNumber(client, 101);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

main().catch(console.error);

async function getChangedNumber(client, accountNumber) {
  const changedNumberDoc = await client
    .db("databaseWeek4")
    .collection("account_balance")
    .findOne({ account_number: accountNumber });
  const lastChange =
    changedNumberDoc.account_changes[
      changedNumberDoc.account_changes.length - 1
    ];
  const changeNumber = lastChange.change_number;
  return changeNumber;
}

async function transferAmount(client, accountOut, accountIn, amount) {
  const accounts = client.db("databaseWeek4").collection("account_balance");
  const session = client.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    const transactionResults = await session.withTransaction(async () => {
      const changeNumberOut = await getChangedNumber(client, accountOut);
      const changeNumberIn = await getChangedNumber(client, accountIn);

      const subtractMoneyUpdate = await accounts.updateOne(
        { account_number: accountOut },
        {
          $inc: { balance: amount * -1 },
          $push: {
            account_changes: {
              change_number: changeNumberOut + 1,
              amount: amount * -1,
              changed_date: new Date(),
              remark: "Transaction is successful",
            },
          },
        },
        { session }
      );

      console.log(
        `${subtractMoneyUpdate.matchedCount} document(s) found in the accounts collection with _id ${accountOut}.`
      );
      console.log(
        `${subtractMoneyUpdate.modifiedCount} document(s) was/were updated to decrease the money.`
      );
      if (subtractMoneyUpdate.modifiedCount !== 1) {
        await session.abortTransaction();
        return;
      }

      const addMoneyUpdate = await accounts.updateOne(
        { account_number: accountIn },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: changeNumberIn + 1,
              amount: amount,
              changed_date: new Date(),
              remark: "Transaction is successful",
            },
          },
        },
        { session }
      );
      console.log(
        `${addMoneyUpdate.matchedCount} and document(s) found in the accounts collection with _id ${accountIn}.`
      );
      console.log(
        `${addMoneyUpdate.modifiedCount} document(s) was/were updated to add the money.`
      );
      if (addMoneyUpdate.modifiedCount !== 1) {
        await session.abortTransaction();
        return;
      }
    }, transactionOptions);
    if (transactionResults) {
      console.log(
        "The money was successfully transferred. Database operations from the transaction are now visible outside the transaction."
      );
    } else {
      console.log(
        "The money was not transferred. The transaction was intentionally aborted."
      );
    }
  } catch (e) {
    console.log(
      "The money was not transferred. The transaction was aborted due to an unexpected error: " +
        e
    );
  } finally {
    await session.endSession();
  }
}
