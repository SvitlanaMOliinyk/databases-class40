const util = require("util");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "accountdb",
});

const execQuery = util.promisify(db.query.bind(db));


module.exports = { db, execQuery }