const express = require("express");
const bodyParser = require("body-parser");
// const { Pool } = require("pg");
const { Sequelize, QueryTypes, DataTypes } = require("sequelize");
const path = require("path");
const { check, oneOf, validationResult } = require("express-validator");
const validator = require("validator");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post(
  "/",

  check("date", "Дата введена некорректно").custom(async (value, { req }) => {
    const dates = value.split(",").map((i) => i.trim());
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors,
        message: "Данные введены не корректно",
      });
    }
    next();
  }
);

app.use(express.static(path.join(__dirname, "views/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views/dist", "index.html"));
});

app.post("/", (req, res) => {
  // console.log(req.body);
  return res.json({ success: "success" });
});

async function connectDb() {
  return new Sequelize(
    "lxhlylvy",
    "lxhlylvy",
    "6EHF5-Ac6GSEjwwFuEmpHYwZdcOyq_BC",
    { host: "rogue.db.elephantsql.com", dialect: "postgres" }
  );
}

const port = 4000;

connectDb().then(async (res) => {
  const client = res;

  const Student = client.define(
    "Student",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          max: 10,
        },
      },
    },
    { tableName: "students" }
  );

  const stusents = await Student.findAll({ attributes: ["id", "name"] });

  // console.log(stusents.map((student) => student.dataValues));

  app.listen(port, () => {
    console.log(`Server is rinning on port ${port}`);
  });
});

// async function connectPg() {
//   const pool = new Pool({
//     user: "lxhlylvy",
//     host: "rogue.db.elephantsql.com",
//     database: "lxhlylvy",
//     password: "6EHF5-Ac6GSEjwwFuEmpHYwZdcOyq_BC",
//     port: 5432,
//   });

//   await pool.connect((err) => {
//     if (err) {
//       return console.log(err);
//     } else {
//       console.log("Db connected");
//     }
//   });

// await pool.connect((err, client, release) => {
//   if (err) {
//     return console.error("Error acquiring client", err);
//   }

//   client.query("SELECT * FROM teachers", (error, res) => {
//     release();

//     if (error) {
//       return console.error("Error executing query", error);
//     }

//     console.log(res.rows);
//   });
// });
// }

// connectPg();
