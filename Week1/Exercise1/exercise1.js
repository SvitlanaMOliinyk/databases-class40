const mysql = require("mysql");
const util = require("util");

let CONNECTION_CONFIG = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
};

const deleteMeetup = `DROP DATABASE meetup`;

const createMeetup = `CREATE DATABASE IF NOT EXISTS meetup`;

const invitee = `CREATE TABLE IF NOT EXISTS Invitee(
        id INT AUTO_INCREMENT,
         invitee_no INT, 
         invitee_name VARCHAR(100),
         invited_by VARCHAR(100),
         PRIMARY KEY(id))`;

const room = `CREATE TABLE IF NOT EXISTS Room(
    id INT AUTO_INCREMENT,
    room_no TINYINT, 
    room_name VARCHAR(100),
    floor_number TINYINT,
    PRIMARY KEY(id))`;

const meeting = `CREATE TABLE IF NOT EXISTS Meeting(
      id INT AUTO_INCREMENT,
      meeting_no INT, 
      meeting_title VARCHAR(300),
      starting_time VARCHAR(100),
      ending_time VARCHAR(100),
      room_no INT,
       PRIMARY KEY(id))`;

function setMeetingData() {
  const day = new Date("December 10, 2022, 10:00:00");
  const meetingDay = new Date();
  meetingDay.setTime(day.getTime());
  const msqlTime = meetingDay.toISOString().slice(0, 16).replace("T", " ");
  const endTime = msqlTime.replace("00", "45");
  let values = [];
  let roomCounter = 10;
  for (let i = 0; i < 5; i++) {
    const meetArr = [
      i + 1,
      `Meeting # ${i + 1}`,
      msqlTime,
      endTime,
      roomCounter,
    ];
    values.push(meetArr);
    roomCounter += 11;
  }
  return values;
}

const meetingValue = setMeetingData();

const inviteeValue = [
  [1, "John Doe", "Peter Crus"],
  [2, "Anna Smith", "Sonia Boom"],
  [3, "Den Roll", "Maria Gonzales"],
  [4, "Boris Bolton", "Andrew Pols"],
  [5, "Mike Adams", "Barbara Hanson"],
];

const roomValue = [
  [10, "East room", 1],
  [21, "West room", 2],
  [32, "South room", 3],
  [43, "North room", 4],
  [54, "Middle room", 5],
];

async function seedDatabase() {
  const db = mysql.createConnection(CONNECTION_CONFIG);
  const execQuery = util.promisify(db.query.bind(db));

  try {
    await execQuery(deleteMeetup);
    await execQuery(createMeetup);
    db.changeUser({ database: "meetup" });
    await execQuery(invitee);
    await execQuery(room);
    await execQuery(meeting);
    await execQuery(
      "INSERT INTO invitee (invitee_no, invitee_name, invited_by) VALUES ?",
      [inviteeValue]
    );
    await execQuery(
      "INSERT INTO room (room_no, room_name, floor_number) VALUES ?",
      [roomValue]
    );

    await execQuery(
      "INSERT INTO meeting (meeting_no,  meeting_title, starting_time, ending_time, room_no) VALUES ?",
      [meetingValue]
    );
    db.end();
  } catch (err) {
    console.error(err.message);
    db.end();
  }
}

seedDatabase();
