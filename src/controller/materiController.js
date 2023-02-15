const { Op } = require("sequelize");

const materiModel = require("../models").materi;
async function getListMateri(req, res) {
  try {
    let { page, pageSize, offset, punya } = req.query;
    if (punya == "saya") {
      const materi = await materiModel.findAndCountAll({
        where: {
          userId: req.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        limit: pageSize,
        offset: offset,
        order: [["id", "ASC"]],
      });
      res.json({
        status: "berhasil",
        msg: "Materi ditemukan",
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalData: materi.count,
        },
        data: materi.rows,
      });
    } else {
      const materi = await materiModel.findAndCountAll({
        limit: pageSize,
        offset: offset,
        order: [["id", "ASC"]],
      });
      res.json({
        status: "berhasil",
        msg: "Materi ditemukan",
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalData: materi.count,
        },
        data: materi,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "Gagal",
      msg: "Materi tidak ditemukan",
    });
  }
}
async function getListMateriSiswa(req, res) {
  try {
    let { page, pageSize, offset, keyword } = req.query;
    const materi = await materiModel.findAndCountAll({
      where: {
        [Op.or]: [
          {
            mataPelajaran: {
              [Op.substring]: keyword,
            },
          },
          {
            kelas: {
              [Op.substring]: keyword,
            },
          },
          {
            materi: {
              [Op.substring]: keyword,
            },
          },
        ],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      limit: pageSize,
      offset: offset,
      order: [["id", "ASC"]],
    });
    res.json({
      status: "berhasil",
      msg: "Materi ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: materi.count,
      },
      data: materi,
    });
  } catch (err) {
    res.status(403).json({
      status: "Gagal",
      msg: "Materi tidak ditemukan",
    });
  }
}

async function createMateriMulti(req, res) {
  try {
    let { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;

    await Promise.all(
      payload.map(async (item, index) => {
        try {
          await materiModel.create({
            mataPelajaran: item.mataPelajaran,
            kelas: item.kelas,
            materi: item.materi,
            userId: req.id,
          });
          success = success + 1;
        } catch (err) {
          fail = fail + 1;
        }
      })
    );

    res.status(201).json({
      status: "201",
      msg: `sukses menambahkan ${success} artikel dari total ${jumlah} artikel dan gagal ${fail} artikel`,
    });
  } catch (err) {
    res.status(403).json({
      status: "error",
      msg: "Anda tidak memiliki akses karena role anda adalah siswa",
    });
  }
}

async function updateMateri(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { mataPelajaran, kelas, materi } = payload;
    const pelajaran = await materiModel.findByPk(id);
    if (pelajaran === null) {
      res.status(403).json({
        status: "fail",
        msg: "artikel tidak ditemukan",
      });
    }

    if (pelajaran.userId !== req.id) {
      return res.status(400).json({
        status: "fail",
        msg: "Anda tidak bisa mengupdate materi ini karena materi ini ditulis oleh guru lain",
      });
    }
    await materiModel.update(
      {
        mataPelajaran,
        kelas,
        materi,
      },
      {
        where: { id: id },
      }
    );

    res.json({
      status: "berhasil",
      msg: "artikel bisa diupdate",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: "artikel bukan punya kamu",
    });
  }
}
async function deleteMateriMulti(req, res) {
  try {
    const { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;

    await Promise.all(
      payload.map(async (item) => {
        try {
          const hapus = await materiModel.findOne({
            where: { id: item.id },
          });
          if (hapus.userId !== req.id) {
            return (fail = fail + 1);
          } else {
            await materiModel.destroy({
              where: { id: item.id },
            });
            success = success + 1;
          }
        } catch (err) {
          fail = fail + 1;
        }
      })
    );

    res.json({
      status: "success",
      msg: `sukses menghapus ${success} artikel dari total ${jumlah} artikel dan gagal ${fail} artikel`,
    });
  } catch (err) {
    res.status(403).json({
      status: "error",
      msg: "tidak bisa menghapus artikel",
    });
  }
}

module.exports = {
  getListMateri,
  getListMateriSiswa,
  createMateriMulti,
  updateMateri,
  deleteMateriMulti,
};
