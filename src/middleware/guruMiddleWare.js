const guruMiddleWare = (req, res, next) => {
  if (req.role !== "Guru") {
    return res.status(403).json({
      status: "error",
      msg: "Anda tidak memiliki akses karena role anda adalah siswa",
    });
  } else {
    next();
  }
};

module.exports = guruMiddleWare;
