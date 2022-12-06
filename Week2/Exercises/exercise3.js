const { db, execQuery } = require("./db");

const mentorQuery = `SELECT 
author_name, mentor_name
FROM mentors
INNER JOIN authors 
ON authors.author_id = mentors.mentor;`;

const paperQuery = `SELECT 
author_name,  university,  date_of_birth,  h_index,  gender, mentor, paper_title 
FROM  authors_papers
JOIN authors ON authors.author_id = authors_papers.author_id
JOIN research_papers ON research_papers.paper_id = authors_papers.paper_id;`;

async function queryDB() {
  db.connect();
  try {
    const mentors = await execQuery(mentorQuery);
    console.log(mentors);

    const paper = await execQuery(paperQuery);
    console.log(paper);
  } catch (error) {
    console.error(error);
    db.end();
  }
  db.end();
}
queryDB();
