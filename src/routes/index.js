const express = require("express");
const {
  getListProduk,
  createProduk,
  getListProdukById,
  getDetailProdukByParams,
  deleteProduk,
} = require("../controller/ProdukController");
const {
  register,
  login,
  updatePassword,
  lupaPassword,
  // lupaPasswordTugas,
  lupaPasswordEmail,
} = require("../controller/authController");
const {
  // getListUser,
  // getListUserById,
  // getDetailUserByParams,
  // createUser,
  // updateUser,
  // deleteUser,
  index,
} = require("../controller/UserController");
const validationResultMiddleware = require("../middleware/validationResultMiddleware");
const createProdukValidator = require("../validators/produkValidator");
const {
  // createUserValidator,
  // updateUserValidator,
  updateNewPassword,
} = require("../validators/userValidator");
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const {
  createArtikel,
  getListArtikel,
  updateArtikel,
  deleteArtikel,
  creatingArtikelBulk,
  createArtikelMulti,
  deleteArtikelMulti,
} = require("../controller/artikelController");
const routers = express.Router();

// *--- AUTH
routers.post("/register", register);
routers.post("/login", login);
routers.post("/lupa-password", lupaPassword);
routers.put("/reset-password/:userId/:token", lupaPasswordEmail);

// *--- implementasi JWT(json web token) validate middleware
routers.use(jwtValidateMiddleware);

routers.put(
  "/update-password",
  updateNewPassword,
  validationResultMiddleware,
  updatePassword
);

// *---

// *--- user
// routers.get("/user/list", getListUser);
// routers.get("/user/detail/:id", getListUserById);
// routers.get("/user/list/:email", getDetailUserByParams);
routers.get("/users", index);
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
routers.get("/artikel/list", getListArtikel);
routers.post("/artikel/create", createArtikel);
routers.put("/artikel/update/:id", updateArtikel);
routers.delete("/artikel/delete/:id", deleteArtikel);
routers.post("/artikel/createBulk", creatingArtikelBulk);
routers.post("/artikel/createMulti", createArtikelMulti);
routers.delete("/artikel/deleteMulti", deleteArtikelMulti);

// *--- produk
routers.get("/produk/list", getListProduk);
routers.post(
  "/create/produk",
  createProdukValidator,
  validationResultMiddleware,
  createProduk
);
routers.get("/produk/detail/:id", getListProdukById);
routers.get("/produk/list/:lokasi", getDetailProdukByParams);
routers.delete("/produk/:id", deleteProduk);

module.exports = routers;
