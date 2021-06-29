const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const prisma = new PrismaClient();

module.exports = class BlogController extends BaseController {
  async createBlog(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    const { title, photo, tags, description } = req.body;

    try {
      await prisma.blog.create({
        data: {
          title: title,
          photo: process.env.BaseUrl + "/images/" + req.file.filename,
          tags: tags,
          description: description,
          admin_id: req.userId,
        },
      });

      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
  async updateBlog(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    const { BlogId, title, photo, tags, description } = req.body;

    const type = await prisma.blog.findUnique({
      where: {
        id: BlogId,
      },
    });

    if (type) {
      try {
        const result = await prisma.blog.update({
          where: {
            id: BlogId,
          },
          data: {
            title: title,
            photo: process.env.BaseUrl + "/images/" + req.file.filename,
            tags: tags,
            description: description,
            admin_id: req.userId,
          },
        });
        if (result) {
          res.json({ status: "ok", data: result });
        } else {
          res.json({ status: "error", error: "some thing went wrong" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "some thing went wrong" });
      }
    }
  }
  async getBlog(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth) {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const result = await prisma.blog.findMany();

      return res.json({ status: "ok", data: result });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
};
