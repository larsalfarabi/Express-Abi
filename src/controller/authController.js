const UserModel = require("../models").user;
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config;

async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password, role } = payload;
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });
    if (user !== null) {
      res.status(422).json({
        status: "gagal",
        msg: "email sudah digunakan,gunakan email yang lain",
      });
    }
    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama,
      email,
      password: hashPassword,
      role,
    });
    res.json({
      status: "berhasil",
      msg: "berhasil register",
    });
  } catch (err) {
    res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan",
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;
    const { email, password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      res.status(422).json({
        status: "gagal",
        msg: "email tidak ditemukan, silahkan register",
      });
    }

    // if (password === null) {
    //   return res.status(422).json({
    //     status: "gagal",
    //     msg: "email dan password tidak cocok",
    //   });
    // }

    const verify = await bcrypt.compareSync(password, user.password);

    const token = await jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        nama: user?.nama,
      },
      process.env.JWT_SCRIPT,
      {
        expiresIn: "10d",
      }
    );

    if (!verify) {
      return res.status(422).json({
        status: "gagal",
        msg: "email dan password tidak cocok",
      });
    }

    res.json({
      status: "berhasil",
      msg: "berhasil login",
      token: token,
      user: user,
    });
  } catch (err) {
    res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan",
    });
  }
}

module.exports = {
  register,
  login,
};
