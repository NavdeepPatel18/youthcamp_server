const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const prisma = new PrismaClient();

module.exports = class AboutUsController extends BaseController {
  async createAboutUs(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    console.log(req.body.photo, "req.body.photo");

    const { title, description } = req.body;

    const type = await prisma.aboutUs.findFirst({
      where: {
        admin_id: req.userId,
      },
    });

    if (type) {
      try {
        await prisma.aboutUs.update({
          where: {
            id: type.id,
          },
          data: {
            title: title,
            description: description,
            photo: process.env.BaseUrl + req.file.filename,
          },
        });

        res.json({ status: "ok" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      try {
        await prisma.aboutUs.create({
          data: {
            title: title,
            description: description,
            photo: "http://127.0.0.1:3000/images/" + req.file.filename,
            admin_id: req.userId,
          },
        });

        res.json({ status: "ok" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    }
  }
  async getAboutUs(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth) {
      return res.json({ status: "error", error: "You  not have access" });
    }

    // const { title, description, photo } = req.body;

    try {
      const result = await prisma.aboutUs.findMany();

      return res.json({ status: "ok", data: result });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
};
