const { db, execQuery } = require("./db");

const mentorQuery = `SELECT A1.author_name, A2.author_name AS mentor_id
FROM authors AS A1
INNER JOIN authors AS A2
WHERE A2.author_id = A1.mentor_id;`;

const paperQuery = `SELECT 
author_name,  university,  date_of_birth,  h_index,  gender, mentor_id, paper_title 
FROM  authors_papers
LEFT JOIN authors ON authors.author_id = authors_papers.author_id
LEFT JOIN research_papers ON research_papers.paper_id = authors_papers.paper_id;`;

async function queryDB() {
  db.connect();
  try {
    const mentors = await execQuery(mentorQuery);
    console.log(mentors);

    const paper = await execQuery(paperQuery);
    console.log(paper);
  } catch (error) {
    console.error(error);
  }
  db.end();
}
queryDB();
