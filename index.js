const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require('cors');
const path = require("path");

const dbPath = path.join(__dirname, "sampledatabase.db");
const app = express();
app.use(express.json());
app.use(cors());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Function to create the "mytext" table if it doesn't exist
    await createMyTextTable();

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

const createMyTextTable = async () => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS mytext (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        text VARCHAR(250)
      );
    `);
    console.log("mytext table created successfully");
  } catch (error) {
    console.log(`Error creating mytext table: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/gettext", async (request, response) => {
  const getallquery = `
    SELECT *
    FROM mytext
    ORDER BY Id
  `;

  const textquery = await db.all(getallquery);
  response.send(textquery);
});

app.post("/addtext", async (request, response) => {
  const addtext = request.body;
  const { text } = addtext;
  const addtextQuery = `
    INSERT INTO mytext(text)
    VALUES (?)
  `;

  const dbResponse = await db.run(addtextQuery, [text]);
  const textId = dbResponse.lastID;
  response.send({ Id: textId });
});






/*const express = require("express");
const mysql = require("mysql2");
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const initializeDbAndServer = () => {
  db.connect((err) => {
    if (err) {
      console.log(`DATABASE ERROR ${err}`);
      process.exit(1);
    }
    console.log("Database Connected Successfully");
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  });
};

app.post("/posttext", (req, res) => {
    const { text } = req.body;
    const createTextQuery = `
      INSERT INTO mytext (text)
      VALUES (${text})
    `;
  
    db.query(createTextQuery, (err, results) => {
      if (err) {
        console.log(`DB ERROR : ${err}`);
        res.status(500).json({ error: "Internal Error" });
      } else {
        res.send(results);
      }
    });
  });
  
app.get("/gettext", (req, res) => {
  const getTextQuery = `
    SELECT *
    FROM mytext
    ORDER BY id
    `;

  db.query(getTextQuery, (err, results) => {
    if (err) {
      console.log(`DB ERROR : ${err}`);
      res.status(500).json({ error: "Internal Error" });
    } else {
      res.send(results);
    }
  });
});






initializeDbAndServer(); */



 