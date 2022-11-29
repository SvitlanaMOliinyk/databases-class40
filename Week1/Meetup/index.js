const express = require("express");
const mysql = require("mysql");

const app = express();

let db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",

});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

app.get("/createmeetup", (req, res) => {
  const sql = "CREATE DATABASE meetup";

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    db.changeUser({ database: "meetup" });
    res.send("Meetup created");
  });
});

app.get("/deletemeetup", (req, res) => {
  const sql = "DROP DATABASE meetup";

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database deleted");
  });
});

app.get("/createinvitee", (req, res) => {
  const sql = `CREATE TABLE IF NOT EXISTS Invitee(
        id INT AUTO_INCREMENT,
         invitee_no INT, 
         invitee_name VARCHAR(100),
         invited_by VARCHAR(100),
         PRIMARY KEY(id))`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Invitee created");
  });
});

app.get("/createroom", (req, res) => {
  const sql = `CREATE TABLE IF NOT EXISTS Room(
        id INT AUTO_INCREMENT,
        room_no INT, 
        room_name VARCHAR(100),
        floor_number INT,
         PRIMARY KEY(id))`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("ROOM created");
  });
});

app.get("/createmeeting", (req, res) => {
  const sql = `CREATE TABLE IF NOT EXISTS Meeting(
        id INT AUTO_INCREMENT,
        meeting_no INT, 
        meeting_title VARCHAR(100),
        starting_time TIMESTAMP,
        ending_time TIMESTAMP,
        room_no INT,
         PRIMARY KEY(id))`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Meeting created");
  });
});

app.get("/addroom", (req, res) => {
  const values = [
    [10, "East room", 1],
    [21, "West room", 2],
    [32, "South room", 3],
    [43, "North room", 4],
    [54, "Middle room", 5],
  ];
  const sql = `INSERT IGNORE INTO room (room_no, room_name, floor_number) values ?`;

  db.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log("Rooms numbers:", result);
    res.send("Rooms added");
  });
});

app.get("/addinvitee", (req, res) => {
  const values = [
    [1, "John Doe", "Peter Crus"],
    [2, "Anna Smith", "Sonia Boom"],
    [3, "Den Roll", "Maria Gonzales"],
    [4, "Boris Bolton", "Andrew Pols"],
    [5, "Mike Adams", "Barbara Hanson"],
  ];

  const sql = `INSERT IGNORE INTO Invitee (invitee_no, invitee_name, invited_by) values ?`;

  db.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log("Invitee:", result);
    res.send("Invitations added");
  });
});

app.get("/addmeeting", (req, res) => {
  const day = new Date("December 10, 2022, 10:00:00");
  const meetingDay = new Date();
  meetingDay.setTime(day.getTime());
  const msqlTime = meetingDay.toISOString().slice(0, 16).replace("T", " ");
  const endTime = msqlTime.replace("00", "45");
  let values = [];
  let counter = 1;
  let roomCounter = 10;
  for (let i = 0; i < 5; i++) {
    const meetArr = [
      counter,
      `Meeting # ${counter}`,
      msqlTime,
      endTime,
      roomCounter,
    ];
    values.push(meetArr);
    counter += 1;
    roomCounter += 11;
  }
  
  const sql = `INSERT IGNORE INTO Meeting (meeting_no,  meeting_title, starting_time, ending_time, room_no) values ?`;

  db.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log("Meeting:", result);
    res.send("Meeting added");
  });
});

app.listen(5000, () => console.log("Server started on 5000"));
