const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main() {
  if (process.env.MONGODB_URI == null) {
    throw Error(`You did not set up the environment variables correctly.`);
  }
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    await queryPopulationByYear(client, "Netherlands");
    await queryTotalPopulationByAge(client, "100+", 2020);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function queryPopulationByYear(client, country) {
  const pipeline = [
    {
      $match: {
        Country: country,
      },
    },
    {
      $group: {
        _id: "$Year",
        countPopulation: {
          $sum: {
            $add: ["$M", "$F"],
          },
        },
      },
    },
    {
      $sort: {
        Year: 1,
        _id: 1,
      },
    },
  ];
  const aggCursor = client
    .db("databaseWeek4")
    .collection("population_pyramid_1950-2022")
    .aggregate(pipeline);

  await aggCursor.forEach((pyramid) => {
    console.log(`${pyramid._id}: ${pyramid.countPopulation}`);
  });
}

async function queryTotalPopulationByAge(client, age, year) {
  const pipeline = [
    {
      $match: {
        Year: year,
        Country: {
          $regex: new RegExp("[A,N,E]$"),
        },
        Age: age,
      },
    },
    {
      $project: {
        Country: 1,
        Year: 1,
        Age: 1,
        M: 1,
        F: 1,
        TotalPopulation: {
          $sum: {
            $add: ["$M", "$F"],
          },
        },
      },
    },
  ];

  const aggCursor = client
    .db("databaseWeek4")
    .collection("population_pyramid_1950-2022")
    .aggregate(pipeline);

  await aggCursor.forEach((pyramid) => {
    console.log(pyramid);
  });
}
