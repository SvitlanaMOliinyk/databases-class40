const mysql = require("mysql");
const util = require("util");

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "scholars",
});

const execQuery = util.promisify(db.query.bind(db));

module.exports = { db, execQuery };
