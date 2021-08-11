module.exports = async function getFilteredLessons(client, reqBody = []) {
  const lessons = [];

  class Lesson {
    constructor(id, date, title, status) {
      this.id = id;
      this.date = date;
      this.title = title;
      this.status = status;
      this.visitCount = 0;
      this.students = [];
      this.teachers = [];
    }
    addStudent(student) {
      if (this.students.find((st) => st.id === student.id)) return;
      this.students.push(student);
      student.visit ? this.visitCount++ : null;
    }
    addTeacher(teacher) {
      if (this.teachers.find((tch) => tch.id === teacher.id)) return;
      this.teachers.push(teacher);
    }
  }
  console.log(reqBody);

  function checkFiltersParams(body) {
    let whereQuery = "";
    if (body.date) {
      if (body.datesArr.length < 2) {
        whereQuery = `WHERE date = '${body.datesArr[0]}'`;
      } else {
        whereQuery = `WHERE date >= '${body.datesArr[0]}'
          AND date <= '${body.datesArr[1]}'`;
      }
    }

    if (body.status !== undefined) {
      if (whereQuery) {
        whereQuery += ` 
          AND status = ${body.status}`;
      } else {
        whereQuery = `WHERE status = ${body.status}`;
      }
    }

    if (body.teacherIds) {
      if (whereQuery) {
        whereQuery += ` 
          AND lesson_teachers.teacher_id IN (${body.teacherIds})`;
      } else {
        whereQuery = `WHERE lesson_teachers.teacher_id IN (${body.teacherIds})`;
      }
    }

    return whereQuery;
  }

  const data = await client.query(`
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
          ON lessons.id = lesson_students.lesson_id
          ${checkFiltersParams(reqBody)}
          ) AS lessonsDraft
    LEFT OUTER JOIN students
    ON lessonsDraft.studentId = students.id
    LEFT OUTER JOIN teachers
    ON lessonsDraft.teacherid = teachers.id
  `);

  const sl = data[0].sort((a, b) => a.id - b.id); // Sorted lessons
  // console.log(data[1]);

  function addStudentAndTeacher(lessonInst, index) {
    lessonInst.addStudent({
      id: sl[index].studentid,
      name: sl[index].studentname,
      visit: sl[index].visit,
    });
    lessonInst.addTeacher({
      id: sl[index].teacherid,
      name: sl[index].teachername,
    });
  }

  for (let i = 0; i < sl.length; i++) {
    if (i === sl.length - 1) break;

    if (sl[i].id === sl[i + 1].id) {
      if (lessons.length === 0) {
        const firstLesson = new Lesson(
          sl[i].id,
          sl[i].date,
          sl[i].title,
          sl[i].status
        );
        lessons.push(firstLesson);
        addStudentAndTeacher(firstLesson, i);
        continue;
      }

      const lastLessonInArr = lessons[lessons.length - 1];
      addStudentAndTeacher(lastLessonInArr, i + 1);
    } else {
      const newLesson = new Lesson(
        sl[i + 1].id,
        sl[i + 1].date,
        sl[i + 1].title,
        sl[i + 1].status
      );
      lessons.push(newLesson);
      addStudentAndTeacher(newLesson, i + 1);
    }
  }
  // const clearLessons = lessons.filter((l) => {
  //   if (reqBody.studentsCount) {
  //     if (reqBody.studentsCountArr.length < 2) {

  //     }
  //   }
  // });
  return lessons;
};
