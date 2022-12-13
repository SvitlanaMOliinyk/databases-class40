const { db, execQuery } = require("./db");

const account = `CREATE TABLE IF NOT EXISTS account(
    account_number INT AUTO_INCREMENT,
    balance DECIMAL(15, 2), 
     PRIMARY KEY(account_number))`;

const accountChanges = `CREATE TABLE IF NOT EXISTS account_changes(
        change_number INT AUTO_INCREMENT,
        account_number INT, 
        amount DECIMAL(15, 2),
        changed_date DATE,
        remark VARCHAR(300),
         PRIMARY KEY(change_number),
         FOREIGN KEY (account_number) REFERENCES account(account_number))`;



async function seedDatabase() {
  try {
    await execQuery(account);
    console.log("account created");
    await execQuery(accountChanges);
    console.log("account_changes created");
    db.end();
  } catch (err) {
    console.error(err.message);
    db.end();
  }
}

seedDatabase();


