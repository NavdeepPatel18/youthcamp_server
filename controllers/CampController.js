const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const prisma = new PrismaClient();

module.exports = class CampController extends BaseController {
  async createCamp(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    const {
      title,
      photo,
      location,
      highlights,
      brochure,
      price,
      duration_day,
      duration_nights,
      difficulty,
      distance,
      age_group,

      campDate,
      packageName,
      schedule,
      campOtherDetail,
      campFaqs,
    } = req.body;

    try {
      await prisma.camp.create({
        data: {
          title: title,
          photo: photo,
          location: location,
          highlights: highlights,
          brochure: brochure,
          price: price,
          duration_day: duration_day,
          duration_nights: duration_nights,
          difficulty: difficulty,
          distance: distance,
          age_group: age_group,

          campDate: {
            create: campDate,
          },
          packageName: {
            create: packageName,
          },
          schedule: {
            create: schedule,
          },
          campOtherDetail: {
            create: campOtherDetail,
          },
          campFaqs: {
            create: campFaqs,
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
  async updateCamp(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    const {
      CampId,
      title,
      photo,
      location,
      highlights,
      brochure,
      price,
      duration_day,
      duration_nights,
      difficulty,
      distance,
      age_group,

      campDate,
      packageName,
      schedule,
      campOtherDetail,
      campFaqs,
    } = req.body;

    const type = await prisma.camp.findUnique({
      where: {
        id: CampId,
      },
    });

    if (type) {
      try {
        const result = await prisma.camp.update({
          where: {
            id: CampId,
          },
          data: {
            title: title,
            photo: photo,
            location: location,
            highlights: highlights,
            brochure: brochure,
            price: price,
            duration_day: duration_day,
            duration_nights: duration_nights,
            difficulty: difficulty,
            distance: distance,
            age_group: age_group,

            campDate: {
              create: campDate,
            },
            packageName: {
              create: packageName,
            },
            schedule: {
              create: schedule,
            },
            campOtherDetail: {
              create: campOtherDetail,
            },
            campFaqs: {
              create: campFaqs,
            },
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
  async getCamp(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth) {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const result = await prisma.camp.findMany({
        include: {
          campDate: true,
          packageName: true,
          schedule: true,
          campOtherDetail: true,
          campFaqs: true,
        },
      });

      return res.json({ status: "ok", data: result });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
};
