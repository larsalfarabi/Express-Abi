const { check } = require("express-validator");
const UserModel = require("../models").user;

const loginValidator = [
  check("email").isEmail().withMessage("gunakan format email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
];

const registerValidator = [
  check("nama").isLength({ min: 1 }).withMessage("nama wajib diisi"),
  check("email")
    .isEmail()
    .withMessage("gunakan format email")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  check("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
];

module.exports = { registerValidator, loginValidator };
