const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
});

function getPopulation(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    "SELECT Population FROM ?? WHERE Name = ? and code = ?",
    [Country, name, code],
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result[0].Population);
    }
  );
  conn.end();
}

function printData(err, result) {
  if (err) {
    console.log("Error: ", err);
  } else {
    console.log("Result: ", result);
  }
}

getPopulation("country", "Andorra' or '1=1", "AND' or '1=1", printData);
