module.exports = async function getFilteredLessons(client, reqBody = []) {
  const lessonsToResponse = [];

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
          ON lessons.id = lesson_students.lesson_id
          
          ) AS lessonsDraft
    LEFT OUTER JOIN students
    ON lessonsDraft.studentId = students.id
    LEFT OUTER JOIN teachers
    ON lessonsDraft.teacherid = teachers.id
  `);

  const sl = lessons[0].sort((a, b) => a.id - b.id); // Sorted lessons

  for (let i = 0; i < sl.length; i++) {
    if (i === sl.length - 1) break;

    if (sl[i].id === sl[i + 1].id) {
      if (lessonsToResponse.length === 0) {
        const firstLesson = new Lesson(
          sl[i].id,
          sl[i].date,
          sl[i].title,
          sl[i].status
        );
        lessonsToResponse.push(firstLesson);
        firstLesson.addStudent({
          id: sl[i].studentid,
          name: sl[i].studentname,
          visit: sl[i].visit,
        });
        firstLesson.addTeacher({
          id: sl[i].teacherid,
          name: sl[i].teachername,
        });
        continue;
      }

      const lastLessonInArr = lessonsToResponse[lessonsToResponse.length - 1];
      lastLessonInArr.addStudent({
        id: sl[i + 1].studentid,
        name: sl[i + 1].studentname,
        visit: sl[i + 1].visit,
      });
      lastLessonInArr.addTeacher({
        id: sl[i + 1].teacherid,
        name: sl[i + 1].teachername,
      });
    } else {
      const newLesson = new Lesson(
        sl[i + 1].id,
        sl[i + 1].date,
        sl[i + 1].title,
        sl[i + 1].status
      );
      lessonsToResponse.push(newLesson);
      newLesson.addStudent({
        id: sl[i + 1].studentid,
        name: sl[i + 1].studentname,
        visit: sl[i + 1].visit,
      });
      newLesson.addTeacher({
        id: sl[i + 1].teacherid,
        name: sl[i + 1].teachername,
      });
    }
  }

  return lessonsToResponse;
};
