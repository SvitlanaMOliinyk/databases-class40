const { db, execQuery } = require("./db");

const countAuthors = `SELECT DISTINCT paper_title, count(authors.author_id)
FROM  authors_papers
LEFT JOIN authors ON authors.author_id = authors_papers.author_id
LEFT JOIN research_papers ON research_papers.paper_id = authors_papers.paper_id
GROUP BY paper_title;`;

const countFemale = `SELECT COUNT(DISTINCT paper_title)
FROM authors_papers
JOIN authors ON authors.author_id = authors_papers.author_id
JOIN research_papers ON research_papers.paper_id = authors_papers.paper_id
WHERE gender = "f";`;

const hirschAVG = `SELECT university, AVG(h_index)
FROM authors                       
GROUP BY university;`;

const universityPapers = `SELECT university, count(DISTINCT paper_title)
FROM authors_papers
JOIN authors ON authors.author_id = authors_papers.author_id
JOIN research_papers ON research_papers.paper_id = authors_papers.paper_id
GROUP BY university;`;

const minMax = `SELECT university, MIN(h_index), MAX(h_index)
FROM authors
GROUP BY university;`;

async function queryDB() {
  db.connect();
  try {
    const authors = await execQuery(countAuthors);
    console.log(
      "All research papers and the number of authors that wrote that paper",
      authors
    );

    const female = await execQuery(countFemale);
    console.log(
      "Sum of the research papers published by all female authors",
      female
    );

    const hirschIndex = await execQuery(hirschAVG);
    console.log(
      "Average of the h-index of all authors per university",
      hirschIndex
    );

    const paperPerUniversity = await execQuery(universityPapers);
    console.log(
      "Sum of the research papers of the authors per university",
      paperPerUniversity
    );

    const minMaxPerUniversity = await execQuery(minMax);
    console.log(
      "Minimum and maximum of the h-index of all authors per university",
      minMaxPerUniversity
    );
  } catch (error) {
    console.error(error);
  }
  db.end();
}
queryDB();
