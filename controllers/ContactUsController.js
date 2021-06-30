const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient, Prisma } = require("@prisma/client");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const { parse } = require("json-bigint");
const prisma = new PrismaClient();

module.exports = class ContactUsController extends BaseController {
  async createContactUs(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }
    if (req.body.data) {
      const { email, phoneno, instaId, fbId } = JSON.parse(req.body.data);

      const find_contactUs = await prisma.contactUs.findFirst({
        where: {
          admin_id: req.userId,
        },
      });

      if (find_contactUs) {
        try {
          await prisma.contactUs.update({
            where: {
              id: find_contactUs.id,
            },
            data: {
              email_id: email,
              phoneno: phoneno,
              insta_id: instaId,
              fb_id: fbId,
              admin_id: req.userId,
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
              admin_id: req.userId,
            },
          });

          res.json({ status: "ok" });
        } catch (error) {
          console.log(error);
          res.json({ status: "error", error: ";))" });
        }
      }
    } else {
      res.json({
        status: "error , no data pass",
      });
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
  async addTeamMember(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body.teamMate && req.file) {
      try {
        const contactUsId = parseInt(req.params.id);
        const teamMate = JSON.parse(req.body.teamMate);

        const find_contactUs = await prisma.contactUs.findFirst({
          where: {
            id: contactUsId,
            admin_id: req.userId,
          },
        });

        if (find_contactUs) {
          teamMate.photo = process.env.BaseUrl + "/images/" + req.file.filename;

          const result = await prisma.contactUs.update({
            where: {
              id: contactUsId,
            },
            data: {
              teamMember: {
                create: teamMate,
              },
            },
          });

          if (result) {
            res.json({ status: "ok" });
          } else {
            res.json({ status: "error", error: "not added" });
          }
        } else {
          res.json({
            status: "error",
            error: "please provid contactUs page detail",
          });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else if (req.body.teamMate) {
      res.json({
        status: "bed request",
        error: "please send data",
      });
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async deleteTeamMember(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.params.id) {
      try {
        const teamMemberId = parseInt(req.params.id);

        const find_teamMate = await prisma.teamMember.findUnique({
          where: {
            id: teamMemberId,
          },
        });

        if (find_teamMate) {
          const delete_teamMate = await prisma.teamMember.delete({
            where: {
              id: teamMemberId,
            },
          });

          if (delete_teamMate) {
            res.json({ status: "ok", response: "deleted" });
          } else {
            res.json({ status: "error", error: "not deleted" });
          }
        } else {
          res.json({ status: "error", error: "teammember not exisits" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      res.json({
        status: "error , teamMember id not defind",
      });
    }
  }
};
