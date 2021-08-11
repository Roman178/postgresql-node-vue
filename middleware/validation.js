const { check, body, oneOf, validationResult } = require("express-validator");
const validator = require("validator");

function customValidation(data, msgReject) {
  if (data.includes(false)) {
    return Promise.reject(msgReject);
  } else {
    return Promise.resolve("ok");
  }
}

module.exports = {
  validateLessonsMdlwr: [
    check("date", "Дата введена некорректно")
      .optional()
      .custom((value, { req }) => {
        const datesArr = value
          .split(",")
          .map((i) => i.trim())
          .sort((a, b) => new Date(a) - new Date(b));
        const datesBool = datesArr.map((d) => validator.isDate(d));
        if (datesBool.length > 2) {
          return Promise.reject(
            "Некорректно выбран период. Введите 2 даты: начало периода, конец периода"
          );
        }
        req.body.datesArr = datesArr;
        return customValidation(datesBool, "Дата введена некорректно");
      }),
    check("status", "Некорректный статус занятия. Введите 0 или 1.")
      .optional()
      .isInt({
        max: 1,
        min: 0,
      }),
    check("teacherIds")
      .optional()
      .custom((value, { req }) => {
        const teacherIdsArr = value.split(",").map((i) => i.trim());
        const teacherIdsBools = teacherIdsArr.map((t) => validator.isInt(t));
        return customValidation(
          teacherIdsBools,
          "Некорректно введены id учителей"
        );
      }),

    check("studentsCount")
      .optional()
      .custom((value, { req }) => {
        const studentsCountArr = value.split(",").map((s) => s.trim());

        const studentsCountBools = studentsCountArr.map((t) => {
          return validator.isInt(t);
        });
        req.body.studentsCountArr = studentsCountArr;
        if (studentsCountBools.length > 2) {
          return Promise.reject(
            "Некорректно введено кол-во учеников. Введите либо 1 число, либо диапазон из 2х чисел."
          );
        }

        return customValidation(
          studentsCountBools,
          "Некорректно введено кол-во учеников"
        );
      }),

    check("page", "Некорректно введен номер страницы").optional().isInt(),
    check("lessonsPerPage", "Некорректно введено кол-во записей на страницу")
      .optional()
      .isInt(),
  ],

  cbLessonsMdlwr: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors,
        message: "Данные введены не корректно",
      });
    }
    if (!req.body.page) req.body.page = 1;
    if (!req.body.lessonsPerPage) req.body.lessonsPerPage = 5;

    next();
  },
};
