const { PrismaClient, Prisma } = require("@prisma/client");

const BaseController = require("./BaseController");
const prisma = new PrismaClient();

module.exports = class HomeController extends BaseController {
  async createHomePage(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body.data) {
      const { title, description, youtubeUrl, homeQuotes } = JSON.parse(
        req.body.data
      );

      const data = {
        title: title,
        description: description,
        youtube_url: youtubeUrl,
        admin_id: req.userId,
        homeQuotes: {
          create: homeQuotes,
        },
      };

      const findHome = await prisma.home.findFirst({
        where: {
          admin_id: req.userId,
        },
      });
      if (findHome) {
        try {
          await prisma.homeQuotes.deleteMany({
            where: {
              home_id: findHome.id,
            },
          });

          if (req.files.homephoto) {
            data.photo =
              process.env.BaseUrl +
              "/images/" +
              req.files.homephoto[0].filename;
          }
          if (req.files.hometitlephoto) {
            data.title_photo =
              process.env.BaseUrl +
              "/images/" +
              req.files.hometitlephoto[0].filename;
          }

          await prisma.home.update({
            where: {
              id: findHome.id,
            },
            data: data,
          });

          res.json({ status: "ok" });
        } catch (error) {
          console.log(error);
          res.json({ status: "error", error: "some thing went wrong" });
        }
      } else {
        try {
          if (req.files.homephoto) {
            data.photo =
              process.env.BaseUrl +
              "/images/" +
              req.files.homephoto[0].filename;
            data.title_photo =
              process.env.BaseUrl +
              "/images/" +
              req.files.homephoto[1].filename;
          }

          await prisma.home.create({
            data: data,
          });

          res.json({ status: "ok" });
        } catch (error) {
          console.log(error);
          res.json({ status: "error", error: "some thing went wrong" });
        }
      }
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async getHomePage(req, res) {
    try {
      const result = await prisma.home.findMany({
        include: {
          homeQuotes: true,
          travelQuotes: true,
          travelStories: true,
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
  async addTravelQuotes(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You not have access" });
    }

    if (req.body && req.file) {
      try {
        const homeId = parseInt(req.params.id);
        const { title } = req.body;
        const travel = {
          title: title,
        };

        const findHome = await prisma.home.findFirst({
          where: {
            id: homeId,
            Admin_id: req.adminId,
          },
        });

        if (findHome) {
          travel.photo = process.env.BaseUrl + "/images/" + req.file.filename;

          const update = await prisma.home.update({
            where: {
              id: homeId,
            },
            data: {
              travelQuotes: {
                create: travel,
              },
            },
          });

          if (update) {
            res.json({ status: "Update Successfully", data: update });
          } else {
            res.json({ status: "error", error: "Not Added..." });
          }
        } else {
          res.json({
            status: "error",
            error: "Please Provide Home Page Details",
          });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: error });
      }
    } else {
      res.json({
        status: "Bad Request",
        error: "No Data Added",
      });
    }
  }
  async deleteTravelQuotes(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You not have access" });
    }

    if (req.params.id) {
      try {
        const travelQuotesId = parseInt(req.params.id);

        const find = await prisma.travelQuotes.findUnique({
          where: {
            id: travelQuotesId,
          },
        });

        if (find) {
          const delete_quote = await prisma.travelQuotes.delete({
            where: {
              id: travelQuotesId,
            },
          });

          if (delete_quote) {
            res.json({ status: `Your Data deleted with id ${travelQuotesId}` });
          } else {
            res.json({ status: "error", error: "not deleted" });
          }
        } else {
          res.json({ status: "error", error: "Travel quote not exist" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      res.json({
        status: "error, Travel quote id not defined",
      });
    }
  }
  async addTravelStories(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You not have access" });
    }

    if (req.body && req.file) {
      try {
        const homeId = parseInt(req.params.id);
        const { review } = req.body;
        const story = {
          review: review,
        };

        const find_story = await prisma.home.findFirst({
          where: {
            id: homeId,
            Admin_id: req.adminId,
          },
        });

        if (find_story) {
          story.photo = process.env.BaseUrl + "/images/" + req.file.filename;

          const update_story = await prisma.home.update({
            where: {
              id: homeId,
            },
            data: {
              travelStories: {
                create: story,
              },
            },
          });

          if (update_story) {
            res.json({ status: "Update Successfully", data: update_story });
          } else {
            res.json({ status: "error", error: "Not Added..." });
          }
        } else {
          res.json({
            status: "error",
            error: "Please Provide Home Page Details",
          });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: error });
      }
    } else {
      res.json({
        status: "Bad Request",
        error: "No Data Added",
      });
    }
  }
  async deleteTravelStories(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You not have access" });
    }

    if (req.params.id) {
      try {
        const travelStoryId = parseInt(req.params.id);

        const find = await prisma.travelStories.findUnique({
          where: {
            id: travelStoryId,
          },
        });

        if (find) {
          const delete_story = await prisma.travelStories.delete({
            where: {
              id: travelStoryId,
            },
          });

          if (delete_story) {
            res.json({ status: `Your Data deleted with id ${travelStoryId}` });
          } else {
            res.json({ status: "error", error: "not deleted" });
          }
        } else {
          res.json({ status: "error", error: "Travel story not exist" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      res.json({
        status: "error, Travel story id not defined",
      });
    }
  }
};
