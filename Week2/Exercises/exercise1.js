const { db, execQuery } = require("./db");

const authorTable = `CREATE TABLE IF NOT EXISTS authors (
    author_id TINYINT,
    author_name VARCHAR(100),
    university VARCHAR(200),
    date_of_birth DATE,
    h_index TINYINT,
    gender ENUM('m', 'f'),
    PRIMARY KEY(author_id)
  );`;

const mentorColumn = "ALTER TABLE authors ADD mentor TINYINT";

const mentorKey = `ALTER TABLE authors 
  ADD CONSTRAINT FK_mentor_id
  FOREIGN KEY (mentor) REFERENCES authors(author_id)
  ;`;

async function seedDatabase() {
  db.connect();
  try {
    await execQuery(authorTable);
    await execQuery(mentorColumn);
    await execQuery(mentorKey);
  } catch (error) {
    console.error(error);
    db.end();
  }

  db.end();
}

seedDatabase();
