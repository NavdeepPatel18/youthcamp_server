const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const prisma = new PrismaClient();

const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

module.exports = class AdminController extends BaseController {
  async changepassword(req, res) {
    const { token, newpassword: plainTextPassword } = req.body;

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    if (plainTextPassword.length < 5) {
      return res.json({
        status: "error",
        error: "Password too small. Should be atleast 6 characters",
      });
    }

    try {
      const admin = jwt.verify(token, JWT_SECRET);

      const adminid = admin.id;

      const newpassword = await bcrypt.hash(plainTextPassword, 10);

      await prisma.admin.update({
        where: {
          id: adminid,
        },
        data: {
          password: newpassword,
        },
      });

      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }

  async login(req, res) {
    const { adminname, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: {
        name: adminname,
      },
    });

    if (!admin) {
      return res.json({ status: "error", error: "Invalid adminname" });
    }

    if (await bcrypt.compare(password, admin.password)) {
      // the adminname, password combination is successful

      const token = jwt.sign(
        {
          userId: admin.id,
          userName: admin.name,
          userType: "ADMIN",
        },
        JWT_SECRET
      );

      return res.json({ status: "ok", data: token });
    }

    res.json({ status: "error", error: "Invalid password" });
  }

  async register(req, res) {
    const { adminname, password: plainTextPassword } = req.body;

    if (!adminname || typeof adminname !== "string") {
      return res.json({ status: "error", error: "Invalid adminname" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    // if (plainTextPassword.length < 5) {
    //   return res.json({
    //     status: "error",
    //     error: "Password too small. Should be atleast 6 characters",
    //   });
    // }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
      const response = await prisma.admin.create({
        data: {
          name: adminname,
          password: password,
        },
      });
      console.log("admin created successfully: ", response);
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({ status: "error", error: "adminname already in use" });
      }
      throw error;
    }

    res.json({ status: "ok" });
  }
};
