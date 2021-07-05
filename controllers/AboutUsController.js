const { PrismaClient } = require("@prisma/client");

const BaseController = require("./BaseController");
const prisma = new PrismaClient();

module.exports = class AboutUsController extends BaseController {
  async createAboutUs(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

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
            photo: process.env.BaseUrl + "/images/" + req.file.filename,
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
            photo: process.env.BaseUrl + "/images/" + req.file.filename,
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
    try {
      const result = await prisma.aboutUs.findMany();

      return res.json({ status: "ok", data: result });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
};
