const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient, Prisma } = require("@prisma/client");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const prisma = new PrismaClient();

module.exports = class HomeController extends BaseController {
  async createHomePage(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    // console.log(req.body);
    // console.log(req.body.teamMemberPhoto, "req.body.photo");
    // console.dir(req.file.teamMemberPhoto, { depth: null });
    // console.log(req.files.teamMemberPhoto, "req.body.photo");

    const {
      title,
      description,
      photo,
      titlePhoto,
      youtubeUrl,
      homeQuotes,
      travelQuotes,
      travelStories,
    } = req.body;

    // console.log("\n" + "email" + "\t" + email);
    // console.log("\n" + "phoneno" + "\t" + phoneno);
    // console.log("\n" + "instaId" + "\t" + instaId);
    // console.log("\n" + "fbId" + "\t" + fbId);
    // console.log("\n" + "teammate" + "\t");
    // console.dir(teamMate[1], { depth: null });

    const type = await prisma.home.findFirst({
      where: {
        admin_id: req.userId,
      },
    });

    if (type) {
      try {
        const deleteHomeQuotes = await prisma.homeQuotes.deleteMany({
          where: {
            home_id: type.id,
          },
        });

        const deleteTravelQuotes = await prisma.travelQuotes.deleteMany({
          where: {
            home_id: type.id,
          },
        });

        const deleteTravelStories = await prisma.travelStories.deleteMany({
          where: {
            home_id: type.id,
          },
        });

        if (deleteHomeQuotes && deleteTravelQuotes && deleteTravelStories) {
          await prisma.home.update({
            where: {
              id: type.id,
            },
            data: {
              title: title,
              description: description,
              photo: photo,
              title_photo: titlePhoto,
              youtube_url: youtubeUrl,
              homeQuotes: {
                create: homeQuotes,
              },
              travelQuotes: {
                create: travelQuotes,
              },
              travelStories: {
                create: travelStories,
              },
              admin_id: req.userId,
            },
          });

          res.json({ status: "ok" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      try {
        await prisma.home.create({
          data: {
            title: title,
            description: description,
            photo: photo,
            title_photo: titlePhoto,
            youtube_url: youtubeUrl,
            homeQuotes: {
              create: homeQuotes,
            },
            travelQuotes: {
              create: travelQuotes,
            },
            travelStories: {
              create: travelStories,
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
  async getHomePage(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth) {
      return res.json({ status: "error", error: "You  not have access" });
    }

    // const { title, description, photo } = req.body;

    try {
      const result = await prisma.home.findMany({
        include: {
          homeQuotes: true,
          travelQuotes:true,
          travelStories:true,
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
