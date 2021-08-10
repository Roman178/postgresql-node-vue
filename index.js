const express = require("express");
// const { Pool } = require("pg");
const { Sequelize, QueryTypes, DataTypes } = require("sequelize");
const path = require("path");
const { check, body, oneOf, validationResult } = require("express-validator");
const validator = require("validator");
const {
  validateLessons,
  cbLessonsMiddleware,
} = require("./middleware/validation.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "views/dist")));

app.use("/", validateLessons, cbLessonsMiddleware);

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

  // const stusents = await Student.findAll({ attributes: ["id", "name"] });

  const lessons = await client.query(`
    SELECT lessonsDraft.*,
           students.name AS studentname,
           teachers.name AS teachername          
    FROM (SELECT lessons.*, 
            lesson_students.student_id AS studentId, lesson_students.visit,
            lesson_teachers.teacher_id AS teacherid
          FROM lessons
          INNER JOIN lesson_teachers 
          ON lessons.id = lesson_teachers.lesson_id
          INNER JOIN lesson_students 
          ON lessons.id = lesson_students.lesson_id) AS lessonsDraft
    LEFT OUTER JOIN students
    ON lessonsDraft.studentId = students.id
    LEFT OUTER JOIN teachers
    ON lessonsDraft.teacherid = teachers.id
  `);

  class Lesson {
    constructor(id, date, title) {
      this.id = id;
      this.date = date;
      this.title = title;
      this.visitCount = 0;
      this.students = [];
      this.teachers = [];
    }

    addStudent() {}
    addTeacher() {}
  }

  console.log(lessons);

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
