const express = require("express");
// const { Pool } = require("pg");
const { Sequelize, QueryTypes, DataTypes } = require("sequelize");
const path = require("path");
const { check, body, oneOf, validationResult } = require("express-validator");
const validator = require("validator");
const {
  validateLessonsMdlwr,
  cbLessonsMdlwr,
} = require("./middleware/validation.js");
const getFilteredLessons = require("./controllers/getFilteredData.controller");

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "views/dist")));

const client = new Sequelize(
  "lxhlylvy",
  "lxhlylvy",
  "6EHF5-Ac6GSEjwwFuEmpHYwZdcOyq_BC",
  { host: "rogue.db.elephantsql.com", dialect: "postgres" }
);

app.use("/", validateLessonsMdlwr, cbLessonsMdlwr);

app.post("/", async (req, res) => {
  try {
    const result = await getFilteredLessons(client, req.body);
    // console.log(result);
    res.json(result);
  } catch (error) {
    res.sendStatus(500).json("");
  }
});

// async function connectDb() {

// }

// connectDb().then(async (response) => {
// const client = response;

// const Student = client.define(
//   "Student",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       validate: {
//         max: 10,
//       },
//     },
//   },
//   { tableName: "students" }
// );

// const stusents = await Student.findAll({ attributes: ["id", "name"] });

// const lessons = await client.query(`
//     SELECT lessonsDraft.*,
//            students.name AS studentname,
//            teachers.name AS teachername
//     FROM (SELECT lessons.*,
//             lesson_students.student_id AS studentId, lesson_students.visit,
//             lesson_teachers.teacher_id AS teacherid
//           FROM lessons
//           INNER JOIN lesson_teachers
//           ON lessons.id = lesson_teachers.lesson_id
//           INNER JOIN lesson_students
//           ON lessons.id = lesson_students.lesson_id

//           ) AS lessonsDraft
//     LEFT OUTER JOIN students
//     ON lessonsDraft.studentId = students.id
//     LEFT OUTER JOIN teachers
//     ON lessonsDraft.teacherid = teachers.id
//   `);

// class Lesson {
//   constructor(id, date, title, status) {
//     this.id = id;
//     this.date = date;
//     this.title = title;
//     this.status = status;
//     this.visitCount = 0;
//     this.students = [];
//     this.teachers = [];
//   }
//   addStudent(student) {
//     if (this.students.find((st) => st.id === student.id)) return;
//     this.students.push(student);
//     student.visit ? this.visitCount++ : null;
//   }
//   addTeacher(teacher) {
//     if (this.teachers.find((tch) => tch.id === teacher.id)) return;
//     this.teachers.push(teacher);
//   }
// }

// const sl = lessons[0].sort((a, b) => a.id - b.id); // Sorted lessons
// console.log(sl);

// const lessonsToResponse = []; // Lessons to ressponse

// for (let i = 0; i < sl.length; i++) {
//   if (i === sl.length - 1) break;

//   if (sl[i].id === sl[i + 1].id) {
//     if (lessonsToResponse.length === 0) {
//       const firstLesson = new Lesson(
//         sl[i].id,
//         sl[i].date,
//         sl[i].title,
//         sl[i].status
//       );
//       lessonsToResponse.push(firstLesson);
//       firstLesson.addStudent({
//         id: sl[i].studentid,
//         name: sl[i].studentname,
//         visit: sl[i].visit,
//       });
//       firstLesson.addTeacher({
//         id: sl[i].teacherid,
//         name: sl[i].teachername,
//       });
//       continue;
//     }

//     const lastLessonInArr = lessonsToResponse[lessonsToResponse.length - 1];
//     lastLessonInArr.addStudent({
//       id: sl[i + 1].studentid,
//       name: sl[i + 1].studentname,
//       visit: sl[i + 1].visit,
//     });
//     lastLessonInArr.addTeacher({
//       id: sl[i + 1].teacherid,
//       name: sl[i + 1].teachername,
//     });
//   } else {
//     const newLesson = new Lesson(
//       sl[i + 1].id,
//       sl[i + 1].date,
//       sl[i + 1].title,
//       sl[i + 1].status
//     );
//     lessonsToResponse.push(newLesson);
//     newLesson.addStudent({
//       id: sl[i + 1].studentid,
//       name: sl[i + 1].studentname,
//       visit: sl[i + 1].visit,
//     });
//     newLesson.addTeacher({
//       id: sl[i + 1].teacherid,
//       name: sl[i + 1].teachername,
//     });
//   }
// }

// console.log(lessonsToResponse);

// console.log(stusents.map((student) => student.dataValues));

app.listen(port, () => {
  console.log(`Server is rinning on port ${port}`);
});
// });

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
