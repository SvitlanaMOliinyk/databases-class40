const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main() {
  if (process.env.MONGODB_URI == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    await deleteListingByName(client);
    await createMultipleListings(client);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

main().catch(console.error);

async function createMultipleListings(client) {
  const accounts = createAccountDoc();
  const result = await client
    .db("databaseWeek4")
    .collection("account_balance")
    .insertMany(accounts);

  console.log(`${result.insertedCount} new document(s) created`);
}

function createAccountDoc() {
  let accounts = [];
  for (i = 1; i <= 200; i++) {
    const randomAccountBalance = +(Math.random() * 100000.0).toFixed(2);
    const accountDocument = {
      account_number: i,
      balance: randomAccountBalance,
      account_changes: [
        {
          change_number: 1,
          amount: randomAccountBalance,
          changed_date: new Date(),
          remark: "Transaction is successful",
        },
      ],
    };
    accounts.push(accountDocument);
  }

  return accounts;
}

async function deleteListingByName(client) {
  const result = await client
    .db("databaseWeek4")
    .collection("account_balance")
    .deleteMany({});
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
