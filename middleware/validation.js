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
  validateLessons: [
    check("date", "Дата введена некорректно")
      .optional()
      .custom((value, { req }) => {
        const dates = value
          .split(",")
          .map((i) => i.trim())
          .map((d) => validator.isDate(d));
        if (dates.length > 2) {
          return Promise.reject(
            "Некорректно выбран период. Введите 2 даты: начало периода, конец периода"
          );
        }
        return customValidation(dates, "Дата введена некорректно");
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
        const teacherIds = value
          .split(",")
          .map((i) => i.trim())
          .map((t) => validator.isInt(t));

        return customValidation(teacherIds, "Некорректно введены id учителей");
      }),

    check("studentsCount")
      .optional()
      .custom((value, { req }) => {
        const studentsCount = value
          .split(",")
          .map((s) => s.trim())
          .map((t) => validator.isInt(t));

        if (studentsCount.length > 2) {
          return Promise.reject(
            "Некорректно введено кол-во учеников. Введите либо 1 число, либо диапазон из 2х чисел."
          );
        }

        return customValidation(
          studentsCount,
          "Некорректно введено кол-во учеников"
        );
      }),

    check("page", "Некорректно введен номер страницы").optional().isInt(),
    check("lessonsPerPage", "Некорректно введено кол-во записей на страницу")
      .optional()
      .isInt(),
  ],

  cbLessonsMiddleware: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors,
        message: "Данные введены не корректно",
      });
    }
    if (!req.body.page) req.body.page = "1";
    if (!req.body.lessonsPerPage) req.body.lessonsPerPage = "5";

    next();
  },
};
