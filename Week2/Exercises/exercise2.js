const { db, execQuery } = require("./db");
const fs = require("fs");
const util = require("util");

const researchTable = `CREATE TABLE IF NOT EXISTS research_papers (
    paper_id INT ,
    paper_title VARCHAR(400),
    conference VARCHAR(200),
    publish_date DATE,
    PRIMARY KEY(paper_id)
  );`;

const authorPaperTable = `CREATE TABLE IF NOT EXISTS authors_papers (
    id INT AUTO_INCREMENT,
    author_id INT,
    paper_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (author_id) REFERENCES authors (author_id),
    FOREIGN KEY (paper_id) REFERENCES research_papers (paper_id)
  );`;

const junctionTable = [
  [1, 9],
  [1, 10],
  [1, 15],
  [2, 8],
  [2, 2],
  [2, 4],
  [2, 29],
  [3, 1],
  [3, 5],
  [4, 4],
  [4, 3],
  [4, 6],
  [4, 7],
  [5, 7],
  [5, 11],
  [5, 12],
  [6, 13],
  [6, 17],
  [6, 18],
  [7, null],
  [8, 19],
  [8, 8],
  [8, 20],
  [9, 14],
  [9, 15],
  [10, 16],
  [10, 8],
  [10, 21],
  [10, 22],
  [11, null],
  [12, 23],
  [12, 24],
  [13, 25],
  [13, 30],
  [13, 15],
  [14, 26],
  [14, 29],
  [15, 27],
  [15, 28],
];

async function seedDatabase() {
  db.connect();
  const readFile = util.promisify(fs.readFile);
  try {
    await execQuery(researchTable);
    await execQuery(authorPaperTable);

    const data = await readFile(__dirname + "/scholars.json", "utf8");
    const scholars = JSON.parse(data);
    const promises = scholars.map((scholar) =>
      execQuery("INSERT INTO authors SET ?", scholar)
    );
    await Promise.all(promises);

    const paperData = await readFile(__dirname + "/papers.json", "utf8");

    const papers = JSON.parse(paperData);
    const paperPromises = papers.map((paper) =>
      execQuery("INSERT INTO research_papers SET ?", paper)
    );
    await Promise.all(paperPromises);

    await execQuery(
      "INSERT INTO authors_papers (author_id, paper_id) VALUES ?",
      [junctionTable]
    );
  } catch (error) {
    console.error(error);
  }

  db.end();
}

seedDatabase();
