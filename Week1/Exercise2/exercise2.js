const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
});

db.connect();

db.query(
  "SELECT name FROM country WHERE population > 8000000",
  function (error, results, fields) {
    if (error) throw error;
    console.log(
      "The names of countries with population greater than 8 million: ",
      results
    );
  }
);

db.query(
  `SELECT name FROM country WHERE name LIKE '%land'`,
  function (error, results, fields) {
    if (error) throw error;
    console.log(
      "The names of countries that have “land” in their names: ",
      results
    );
  }
);

db.query(
  `SELECT name, population FROM country WHERE population BETWEEN 500000 AND 1000000`,
  function (error, results, fields) {
    if (error) throw error;
    console.log(
      "The names of the cities with population in between 500,000 and 1 million: ",
      results
    );
  }
);

db.query(
  `SELECT name FROM country WHERE continent = 'Europe'`,
  function (error, results, fields) {
    if (error) throw error;
    console.log("The name of all the countries on Europe: ", results);
  }
);

db.query(
  `SELECT name, surfaceArea FROM country
  ORDER BY surfaceArea DESC`,
  function (error, results, fields) {
    if (error) throw error;
    console.log(
      "The countries in the descending order of their surface areas: ",
      results
    );
  }
);

db.query(
  `SELECT name FROM city
    WHERE countryCode = 'NLD'`,
  function (error, results, fields) {
    if (error) throw error;
    console.log("The names of all the cities in the Netherlands: ", results);
  }
);

db.query(
  `SELECT name, population FROM city
    WHERE name = 'Rotterdam'`,
  function (error, results, fields) {
    if (error) throw error;
    console.log("The population of Rotterdam: ", results);
  }
);

db.query(
  `SELECT name, surfaceArea FROM country
    ORDER BY surfaceArea DESC
    LIMIT 10`,
  function (error, results, fields) {
    if (error) throw error;
    console.log("The top 10 countries by Surface Area: ", results);
  }
);

db.query(
  `SELECT name, population FROM city
    ORDER BY population DESC
    LIMIT 10`,
  function (error, results, fields) {
    if (error) throw error;
    console.log("The  top 10 most populated cities: ", results);
  }
);

db.query(
  `SELECT SUM(population) FROM country`,
  function (error, results, fields) {
    if (error) throw error;
    console.log("The population number of the world: ", results);
  }
);

db.end();
