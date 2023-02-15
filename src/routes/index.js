const express = require("express");
// const {
//   getListProduk,
//   createProduk,
//   getListProdukById,
//   getDetailProdukByParams,
//   deleteProduk,
// } = require("../controller/ProdukController");
const { register, login } = require("../controller/authController");
const {
  loginValidator,
  registerValidator,
} = require("../validators/userValidator");
// const {
//   getListUser,
//   getListUserById,
//   getDetailUserByParams,
//   createUser,
//   updateUser,
//   deleteUser,
// } = require("../controller/UserController");
const validationResultMiddleware = require("../middleware/validationResultMiddleware");
const {
  getListMateri,
  getListMateriSiswa,
  createMateriMulti,
  updateMateri,
  deleteMateriMulti,
} = require("../controller/materiController");
// const createProdukValidator = require("../validators/produkValidator");
// const {
//   createUserValidator,
//   updateUserValidator,
//   updateNewPassword,
// } = require("../validators/userValidator");
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const guruMiddleWare = require("../middleware/guruMiddleWare");
// const {
//   createArtikel,
//   getListArtikel,
//   updateArtikel,
//   deleteArtikel,
//   creatingArtikelBulk,
//   createArtikelMulti,
//   deleteArtikelMulti,
// } = require("../controller/artikelController");
const routers = express.Router();

// *--- AUTH
routers.post(
  "/register",
  registerValidator,
  validationResultMiddleware,
  register
);
routers.post("/login", loginValidator, validationResultMiddleware, login);

// *--- implementasi JWT(json web token) validate middleware
routers.use(jwtValidateMiddleware);
routers.use(guruMiddleWare);
//* ---materi
routers.get("/materi/list/guru", getListMateri);
routers.get("/materi/list/siswa", getListMateriSiswa);
routers.post(
  "/materi/create",

  createMateriMulti
);
routers.put("/materi/update/:id", updateMateri);
routers.delete("/materi/delete", deleteMateriMulti);
// *--- user
// routers.get("/user/list", getListUser);
// routers.get("/user/detail/:id", getListUserById);
// routers.get("/user/list/:email", getDetailUserByParams);
// routers.post(
//   "/create/user",
//   createUserValidator,
//   validationResultMiddleware,
//   createUser
// );
// routers.put(
//   "/user/update/:id",
//   updateUserValidator,
//   validationResultMiddleware,
//   updateUser
// );
// routers.delete("/user/delete/:id", deleteUser);

// *--- artikel
// routers.get("/artikel/list", getListArtikel);
// routers.post("/artikel/create", createArtikel);
// routers.put("/artikel/update/:id", updateArtikel);
// routers.delete("/artikel/delete/:id", deleteArtikel);
// routers.post("/artikel/createBulk", creatingArtikelBulk);
// routers.post("/artikel/createMulti", createArtikelMulti);
// routers.delete("/artikel/deleteMulti", deleteArtikelMulti);

// *--- produk
// routers.get("/produk/list", getListProduk);
// routers.post(
//   "/create/produk",
//   createProdukValidator,
//   validationResultMiddleware,
//   createProduk
// );
// routers.get("/produk/detail/:id", getListProdukById);
// routers.get("/produk/list/:lokasi", getDetailProdukByParams);
// routers.delete("/produk/:id", deleteProduk);

module.exports = routers;
