const { PrismaClient } = require("@prisma/client");

const BaseController = require("./BaseController");
const prisma = new PrismaClient();

module.exports = class CampController extends BaseController {
  async createCamp(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }
    if (req.body.data && req.files) {
      try {
        const {
          title,
          location,
          highlights,
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
        } = JSON.parse(req.body.data);

        const File = req.files;

        if (File.packagephoto && File.schedulephoto) {
          var i = 0,
            j = 0;
          packageName.forEach((element) => {
            element.photo =
              process.env.BaseUrl + "/images/" + File.packagephoto[i].filename;
            i++;
          });

          schedule.forEach((element) => {
            element.photo =
              process.env.BaseUrl + "/images/" + File.schedulephoto[j].filename;
            j++;
          });
        }

        const data = {
          title: title,
          location: location,
          highlights: highlights,
          price: price,
          duration_day: duration_day,
          duration_nights: duration_nights,
          difficulty: difficulty,
          distance: distance,
          age_group: age_group,
          admin_id: req.userId,
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
        };

        if (File.basicphoto) {
          data.photo =
            process.env.BaseUrl + "/images/" + req.files.basicphoto[0].filename;
        }
        if (File.brochure) {
          data.brochure =
            process.env.BaseUrl + "/images/" + req.files.brochure[0].filename;
        }

        await prisma.camp.create({
          data: data,
        });

        res.json({ status: "ok" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Some thing went wrong" });
      }
    } else if (req.body.data) {
      res.json({
        status: "bed request",
        error: "please send files",
      });
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async updateCamp(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body.data && req.files) {
      console.log(req.files);
      try {
        const findCamp = await prisma.camp.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        if (findCamp) {
          const {
            title,
            location,
            highlights,
            price,
            duration_day,
            duration_nights,
            difficulty,
            distance,
            age_group,
            campOtherDetail,
          } = JSON.parse(req.body.data);

          const data = {
            title: title,
            location: location,
            highlights: highlights,
            price: price,
            duration_day: duration_day,
            duration_nights: duration_nights,
            difficulty: difficulty,
            distance: distance,
            age_group: age_group,
            campOtherDetail: {
              create: campOtherDetail,
            },
          };

          console.log(data);

          if (File.basicphoto) {
            data.photo =
              process.env.BaseUrl +
              "/images/" +
              req.files.basicphoto[0].filename;
          }
          if (File.brochure) {
            data.brochure =
              process.env.BaseUrl + "/images/" + req.files.brochure[0].filename;
          }

          await prisma.campOtherDetail.deleteMany({
            where: {
              camp_id: findCamp.id,
            },
          });

          const result = await prisma.camp.update({
            where: {
              id: findCamp.id,
            },
            data: data,
          });

          if (result) {
            res.json({ status: "ok", data: result });
          } else {
            res.json({ status: "error", error: "some thing went wrong" });
          }
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Some thing went wrong" });
      }
    } else if (req.body.data) {
      res.json({
        status: "bed request",
        error: "please send files",
      });
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async addCampDate(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body) {
      try {
        const findCamp = await prisma.camp.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        if (findCamp) {
          const { start, end } = req.body;

          const data = {
            start: start,
            end: end,
          };

          console.log(data);

          const result = await prisma.camp.update({
            where: {
              id: findCamp.id,
            },
            data: {
              campDate: {
                create: data,
              },
            },
          });

          if (result) {
            res.json({ status: "ok", data: result });
          } else {
            res.json({ status: "error", error: "some thing went wrong" });
          }
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Some thing went wrong" });
      }
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async addPackage(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body.data && req.files) {
      console.log(req.files);
      try {
        const findCamp = await prisma.camp.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        if (findCamp) {
          const { name, subpackage, price, noday_nonight } = JSON.parse(
            req.body.data
          );

          const data = {
            name: name,
            subpackage: subpackage,
            price: price,
            noday_nonight: noday_nonight,
          };

          console.log(data);

          if (req.files.photo) {
            data.photo =
              process.env.BaseUrl + "/images/" + req.files.photo[0].filename;
          }

          const result = await prisma.camp.update({
            where: {
              id: findCamp.id,
            },
            data: {
              packageName: {
                create: data,
              },
            },
          });

          if (result) {
            res.json({ status: "ok", data: result });
          } else {
            res.json({ status: "error", error: "some thing went wrong" });
          }
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Some thing went wrong" });
      }
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async addSchedule(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body.data && req.files) {
      console.log(req.files);
      try {
        const findCamp = await prisma.camp.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        if (findCamp) {
          const { dayno, day_title, description } = JSON.parse(req.body.data);

          const data = {
            dayno: dayno,
            day_title: day_title,
            description: description,
          };

          console.log(data);

          if (req.files.photo) {
            data.photo =
              process.env.BaseUrl + "/images/" + req.files.photo[0].filename;
          }

          const result = await prisma.camp.update({
            where: {
              id: findCamp.id,
            },
            data: {
              schedule: {
                create: data,
              },
            },
          });

          if (result) {
            res.json({ status: "ok", data: result });
          } else {
            res.json({ status: "error", error: "some thing went wrong" });
          }
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Some thing went wrong" });
      }
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async addFAQS(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body) {
      try {
        const findCamp = await prisma.camp.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        if (findCamp) {
          const { question, answer } = req.body;

          const data = {
            question: question,
            answer: answer,
          };

          console.log(data);

          const result = await prisma.camp.update({
            where: {
              id: findCamp.id,
            },
            data: {
              campFaqs: {
                create: data,
              },
            },
          });

          if (result) {
            res.json({ status: "ok", data: result });
          } else {
            res.json({ status: "error", error: "some thing went wrong" });
          }
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Some thing went wrong" });
      }
    } else if (req.body.data) {
      res.json({
        status: "bed request",
        error: "please send files",
      });
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async getCamp(req, res) {
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
  async deletecamp(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const campID = parseInt(req.params.id);

      const findCamp = await prisma.camp.findUnique({
        where: {
          id: campID,
        },
      });

      if (findCamp) {
        await prisma.campDate.deleteMany({
          where: {
            camp_id: campID,
          },
        });

        await prisma.packageName.deleteMany({
          where: {
            camp_id: campID,
          },
        });

        await prisma.schedule.deleteMany({
          where: {
            camp_id: campID,
          },
        });

        await prisma.campOtherDetail.deleteMany({
          where: {
            camp_id: campID,
          },
        });

        await prisma.campFaqs.deleteMany({
          where: {
            camp_id: campID,
          },
        });

        const deleteCamp = await prisma.camp.delete({
          where: {
            id: campID,
          },
        });

        if (deleteCamp) {
          res.json({ status: "ok", response: "deleted" });
        } else {
          res.json({ status: "error", error: "not deleted" });
        }
      } else {
        res.json({ status: "error", error: "camp not valid" });
      }
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
  async deleteCampDate(req, res) {
    console.log(
      req.isAuth + "\n" + req.userId + "\n" + req.userName + "\n" + req.userType
    );

    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const campdateId = parseInt(req.params.id);

      const findCampDate = await prisma.campDate.findUnique({
        where: {
          id: campdateId,
        },
      });

      if (findCampDate) {
        const deleteCampdate = await prisma.campDate.delete({
          where: {
            id: campdateId,
          },
        });

        if (deleteCampdate) {
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
  }
  async deletePackage(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const campPackageID = parseInt(req.params.id);

      const findPackage = await prisma.packageName.findUnique({
        where: {
          id: campPackageID,
        },
      });

      if (findPackage) {
        const deletePackage = await prisma.packageName.delete({
          where: {
            id: campPackageID,
          },
        });

        if (deletePackage) {
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
  }
  async deleteSchedule(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const scheduleID = parseInt(req.params.id);

      const findSchedule = await prisma.schedule.findUnique({
        where: {
          id: scheduleID,
        },
      });

      if (findSchedule) {
        const deleteSchedule = await prisma.schedule.delete({
          where: {
            id: scheduleID,
          },
        });

        if (deleteSchedule) {
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
  }
  async deleteCampOtherDetail(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const otherdetailId = parseInt(req.params.id);

      const findOtherdetail = await prisma.campOtherDetail.findUnique({
        where: {
          id: otherdetailId,
        },
      });

      if (findOtherdetail) {
        const deleteOtherdetail = await prisma.campOtherDetail.delete({
          where: {
            id: otherdetailId,
          },
        });

        if (deleteOtherdetail) {
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
  }
  async deleteCampFAQS(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    try {
      const faqsID = parseInt(req.params.id);

      const findFAQS = await prisma.campFaqs.findUnique({
        where: {
          id: faqsID,
        },
      });

      if (findFAQS) {
        const deleteFAQS = await prisma.campFaqs.delete({
          where: {
            id: faqsID,
          },
        });

        if (deleteFAQS) {
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
  }
};
