const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient, Prisma } = require("@prisma/client");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const prisma = new PrismaClient();

module.exports = class ContactUsController extends BaseController {
  async createContactUs(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    console.dir(JSON.parse(req.body.data), { depth: null });
    console.log(req.body.teamMemberPhoto, "req.body.photo");
    // console.dir(req.file.teamMemberPhoto, { depth: null });
    console.log(req.files.teamMemberPhoto, "req.body.photo");

    const { email, phoneno, instaId, fbId, teamMate } = JSON.parse(
      req.body.data
    );
    var teamMember = teamMate;

    console.log("\n" + "email" + "\t" + email);
    console.log("\n" + "phoneno" + "\t" + phoneno);
    console.log("\n" + "instaId" + "\t" + instaId);
    console.log("\n" + "fbId" + "\t" + fbId);
    console.log("\n" + "teammate" + "\t");
    // console.dir(teamMate[1], { depth: null });

    const type = await prisma.contactUs.findFirst({
      where: {
        admin_id: req.userId,
      },
    });

    if (type) {
      try {
        console.dir(teamMember, { depth: null });

        var i = 0;
        teamMember.forEach((element) => {
          element.photo =
          process.env.BaseUrl +"/images/" + req.files.teamMemberPhoto[i].filename;
          i = i + 1;
        });

        console.dir(teamMate, { depth: null });
        const deleteUser = await prisma.teamMember.deleteMany({
          where: {
            contactUs_id: type.id,
          },
        });

        await prisma.contactUs.update({
          where: {
            id: type.id,
          },
          data: {
            email_id: email,
            phoneno: phoneno,
            insta_id: instaId,
            fb_id: fbId,
            admin_id: req.userId,
            teamMember: {
              create: teamMate,
            },
          },
        });

        res.json({ status: "ok" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      try {
        await prisma.contactUs.create({
          data: {
            email_id: email,
            phoneno: phoneno,
            insta_id: instaId,
            fb_id: fbId,
            teamMember: {
              create: teamMate,
            },
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
  async getContactUs(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth) {
      return res.json({ status: "error", error: "You  not have access" });
    }

    // const { title, description, photo } = req.body;

    try {
      const result = await prisma.contactUs.findMany({
        include: {
          teamMember: true,
        },
      });

      return this.sendJSONResponse(
        res,
        null,
        {
          length: 1,
        },
        result
      );
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
};
