const { Op } = require("sequelize");
const IdentitasModel = require("../models").identitas;
const UserModel = require("../models").user;

// *---- get semua user
// async function getListUser(req, res) {
//   try {
//     const users = await UserModel.findAll();
//     res.json({
//       status: "berhasil",
//       msg: "Data ditemukan",
//       data: users,
//     });
//   } catch (err) {
//     res.status(403).json({
//       status: "fail",
//       msg: "ada kesalahan",
//     });
//   }
// }

// *---- create data ke database
// async function createUser(req, res) {
//   try {
//     const payload = req.body;
//     let { name, email, tempatLahir, tanggalLahir } = payload;
//     const user = await UserModel.create({
//       name: name,
//       email: email,
//       isActive: true,
//       tempatLahir: tempatLahir,
//       tanggalLahir: tanggalLahir,
//     });
//     res.status(201).json({
//       status: "berhasil",
//       msg: "barhasil manambah",
//       data: user,
//     });
//   } catch (err) {
//     res.status(403).json({
//       status: "fail",
//       msg: "ada kesalahan",
//     });
//   }
// }

// *---- get by id
// async function getListUserById(req, res) {
//   try {
//     const { id } = req.params;

//     const user = await UserModel.findByPk(id);

//     if (user === null) {
//       res.status(404).json({
//         status: "fail",
//         msg: "user tidak ditemukan",
//       });
//     }
//     res.json({
//       status: "berhasil",
//       msg: "user ditemukan",
//       data: user,
//     });
//   } catch (err) {
//     res.status(403).json({
//       status: "gagal",
//       smg: "tidak ditemukan",
//     });
//   }
// }

// *--- get by params
// async function getDetailUserByParams(req, res) {
//   try {
//     const { email } = req.params;

//     const user = await UserModel.findOne({
//       where: {
//         email: email,
//       },
//     });
//     res.json({
//       status: "berhasil",
//       msg: "user ditemukan",
//       data: user,
//     });
//   } catch (err) {
//     res.status(403).json({
//       status: "gagal",
//       smg: "user tidak ditemukan",
//     });
//   }
// }

// *---- update
// async function updateUser(req, res) {
//   try {
//     const { id } = req.params;
//     const payload = req.body;
//     const { name, tempatLahir, tanggalLahir } = payload;
//     const user = await UserModel.findByPk(id);

//     if (user === null) {
//       res.status(404).json({
//         status: "fail",
//         msg: "user tidak ditemukan",
//       });
//     }
    // *---- cara 1
    // await UserModel.update(
    //   {
    //     name: name,
    //     tempatLahir: tempatLahir,
    //     tanggalLahir: tanggalLahir,
    //   },
    //   {
    //     where: {
    //       id: id,
    //     },
    //   }
    // );

    // *---- cara 2
//     await UserModel.update(
//       {
//         name,
//         tempatLahir,
//         tanggalLahir,
//       },
//       {
//         where: {
//           id: id,
//         },
//       }
//     );
//     res.json({
//       status: "berhasil",
//       msg: "berhasil mengupdate user",
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       msg: "gagal mengupdate user",
//     });
//   }
// }

// async function deleteUser(req, res) {
//   try {
//     const { id } = req.params;
//     const user = await UserModel.findByPk(id);

//     if (user === null) {
//       res.status(404).json({
//         status: "fail",
//         msg: "user tidak ditemukan",
//       });
//     }
//     await UserModel.destroy({
//       where: {
//         id: id,
//       },
//     });

//     res.json({
//       status: "berhasil",
//       msg: "berhasil menghapus user",
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       msg: "user tidak bisa dihapus",
//     });
//   }
// }

const index = async (req, res) => {
  try {
    let { keyword, page, pageSize, orderBy, sortBy, pageActive } = req.query;

    const users = await UserModel.findAndCountAll({
      attributes: [
        "id",
        ["name", "nama"],
        "email",
        "password",
        "status",
        "jenisKelamin",
      ],
      where: {
        ...(keyword !== undefined && {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              jenisKelamin: {
                [Op.like]: `%${keyword}%`,
              },
            },
          ],
        }),
      },
      include: [
        {
          model: IdentitasModel,
          require: true,
          as: "identitas",
          attributes: ["id", "nama", "alamat", "tempatLahir", "tanggalLahir"],
        },
      ],
      order: [[sortBy, orderBy]],
      limit: page,
      offset: pageSize, //* <--- banyak data yang ditampilkan
    });
    console.log("page", page);
    console.log("pageSize", pageSize);
    res.json({
      status: "success",
      msg: "Daftar user ditemukan",
      data: users,
      pagination: {
        page: pageActive,
        nextPage: page + 1,
        previousPage: pageActive + 1,
        pageSize: pageSize,
        jumlah: users.rows.length,
        total: users.count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      msg: "Ada kesalahan",
    });
  }
};
module.exports = {
  // getListUser,
  // getListUserById,
  // getDetailUserByParams,
  // createUser,
  // updateUser,
  // deleteUser,
  index,
};
