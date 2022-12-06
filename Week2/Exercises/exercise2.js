const { db, execQuery } = require("./db");
const fs = require("fs");
const util = require("util");

const researchTable = `CREATE TABLE IF NOT EXISTS research_papers (
    paper_id TINYINT PRIMARY KEY,
    paper_title VARCHAR(400),
    conference VARCHAR(200),
    publish_date DATE
  );`;

const mentorTable = `CREATE TABLE IF NOT EXISTS mentors (
    mentor TINYINT PRIMARY KEY,
   mentor_name VARCHAR(200),
    CONSTRAINT FK_mentor_author
    FOREIGN KEY (mentor) 
    REFERENCES authors(mentor)
  );`;

const authorPaperTable = `CREATE TABLE IF NOT EXISTS authors_papers (
    author_id TINYINT,
    paper_id TINYINT,
    PRIMARY KEY(author_id,  paper_id)
  );`;

const junctionTable = [
  [1, 9],
  [1, 10],
  [2, 8],
  [2, 2],
  [2, 4],
  [3, 1],
  [3, 5],
  [4, 3],
  [4, 6],
  [4, 7],
  [5, 11],
  [5, 12],
  [6, 13],
  [6, 17],
  [7, 18],
  [8, 19],
  [8, 20],
  [9, 14],
  [9, 15],
  [10, 16],
  [10, 21],
  [11, 22],
  [11, 23],
  [12, 24],
  [13, 25],
  [13, 30],
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
    await execQuery(mentorTable);

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

    const mentorsData = await readFile(__dirname + "/mentors.json", "utf8");
    const mentors = JSON.parse(mentorsData);
    const mentorsPromises = mentors.map((mentor) =>
      execQuery("INSERT INTO mentors SET ?", mentor)
    );
    await Promise.all(mentorsPromises);

    await execQuery(
      "INSERT INTO authors_papers (author_id, paper_id) VALUES ?",
      [junctionTable]
    );
  } catch (error) {
    console.error(error);
    db.end();
  }

  db.end();
}

seedDatabase();
