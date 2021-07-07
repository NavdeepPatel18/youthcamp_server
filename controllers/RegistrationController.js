const { PrismaClient } = require("@prisma/client");

const BaseController = require("../controllers/BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");

const prisma = new PrismaClient();

async function addUser(data, file) {
  try {
    const userDetail = {
      name: data.name,
      mobileno: data.mobileno,
      email: data.email,
      idprof_name: data.idprof_name,
      dob: data.dob,
      gender: data.gender,
    };
    if (file.id_prof1) {
      userDetail.id_prof1 =
        process.env.BaseUrl + "/images/" + file.id_prof1[0].filename;
    }
    if (file.id_prof2) {
      userDetail.id_prof2 =
        process.env.BaseUrl + "/images/" + file.id_prof2[0].filename;
    }

    console.log(userDetail);

    const userId = await prisma.user.create({
      data: userDetail,
    });
    console.log(userId);
    if (userId) {
      data.user_id = BigInt(userId);
    } else {
      return res.json({
        status: "error",
        error: "Something went wrong",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "error",
      error: "Something went wrong",
    });
  }
}

module.exports = class RegisterUser extends BaseController {
  async registration(req, res) {
    if (!req.isAuth) {
      return res.json({ status: "error", error: "You  not have access" });
    }
    if (req.body.data) {
      const {
        name,
        mobileno,
        email,
        idprof_name,
        dob,
        gender,
        health_problem,
        blood_group,
        camp_name,
        package_name,
        travel_mode,
        start_date,
        end_date,
      } = JSON.parse(req.body.data);

      const data = {
        name: name,
        mobileno: mobileno,
        email: email,
        idprof_name: idprof_name,
        dob: dob,
        gender: gender,
        health_problem: health_problem,
        blood_group: blood_group,
        camp_name: camp_name,
        package_name: package_name,
        travel_mode: travel_mode,
        start_date: start_date,
        end_date: end_date,
        status: "pendding",
      };
      if (req.userType === "USER") {
        console.log(req.userId);
        data.user_id = BigInt(req.userId);
      } else {
        try {
          const find = await prisma.user.findUnique({
            where: {
              email: data.email,
            },
          });
          console.log(find);
          if (!find) {
            await addUser(data, req.files);
          } else {
            data.user_id = BigInt(find.id);
            console.log(data.user_id);
          }
        } catch (err) {}
      }
      try {
        if (req.files.id_prof1) {
          data.id_prof1 =
            process.env.BaseUrl + "/images/" + req.files.id_prof1[0].filename;
        }
        if (req.files.id_prof2) {
          data.id_prof2 =
            process.env.BaseUrl + "/images/" + req.files.id_prof2[0].filename;
        }

        const response = await prisma.registration.create({
          data: data,
        });

        console.log("Registration Successfully...");
        return this.sendJSONResponse(
          res,
          "Registration Successfully.",
          {
            length: 1,
          },
          response
        );
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Something happend" });
      }
    } else {
      res.json({ status: "error", error: "Please provide data" });
    }
  }

  async addParticipate(req, res) {
    if (!req.isAuth && (req.userType === "USER" || req.userType === "ADMIN")) {
      return res.json({ status: "error", error: "You  not have access" });
    }
    if (req.body.data) {
      const registrationId = parseInt(req.params.id);
      const {
        name,
        mobileno,
        email,
        idprof_name,
        dob,
        gender,
        health_problem,
        blood_group,
      } = JSON.parse(req.body.data);
      const findId = await prisma.registration.findUnique({
        where: {
          id: registrationId,
        },
      });

      if (!findId) {
        res.json({ status: "error", error: "First book camp." });
      }

      try {
        const participant = {
          name: name,
          mobileno: mobileno,
          email: email,
          idprof_name: idprof_name,
          dob: dob,
          gender: gender,
          health_problem: health_problem,
          blood_group: blood_group,
        };

        if (req.files.id_prof1) {
          participant.id_prof1 =
            process.env.BaseUrl + "/images/" + req.files.id_prof1[0].filename;
        }
        if (req.files.id_prof2) {
          participant.id_prof2 =
            process.env.BaseUrl + "/images/" + req.files.id_prof2[0].filename;
        }
        console.log(participant);

        const update = await prisma.registration.update({
          where: {
            id: registrationId,
          },
          data: {
            participants: {
              create: participant,
            },
          },
        });

        if (update) {
          return this.sendJSONResponse(
            res,
            "Participate added Successfully.",
            {
              length: 1,
            },
            update
          );
        } else {
          res.json({ status: "error", error: "Not Added..." });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Something happend" });
      }
    } else {
      res.json({
        status: "error",
        error: "Please Provide Participants Details",
      });
    }
  }

  async deleteParticipants(req, res) {
    if (!req.isAuth && (req.userType === "USER" || req.userType === "ADMIN")) {
      return res.json({ status: "error", error: "You  not have access" });
    }
    if (req.params.id) {
      try {
        const participantId = parseInt(req.params.id);

        const find = await prisma.participants.findUnique({
          where: {
            id: participantId,
          },
        });

        if (find) {
          const delete_participant = await prisma.participants.delete({
            where: {
              id: participantId,
            },
          });

          if (delete_participant) {
            res.json({ status: `Your Data deleted with id ${participantId}` });
          } else {
            res.json({ status: "error", error: "not deleted" });
          }
        } else {
          res.json({ status: "error", error: "Participant not exist" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      res.json({
        status: "error, Participant id not defined",
      });
    }
  }

  async getRegistration(req, res) {
    if (!req.isAuth) {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.userType === "USER") {
      try {
        const result = await prisma.registration.findMany({
          where: {
            user_id: BigInt(req.userId),
          },
          include: {
            participants: true,
          },
        });
        return this.sendJSONResponse(
          res,
          "Registration Successfully.",
          {
            length: 1,
          },
          result
        );
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Something wrong" });
      }
    } else {
      try {
        const result = await prisma.registration.findMany({
          include: {
            participants: true,
          },
        });
        return this.sendJSONResponse(
          res,
          "Registration Successfully.",
          {
            length: 1,
          },
          result
        );
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "Somthing wrong" });
      }
    }
  }

  /*async changeDetails(req, res) {

        const { name, mobileno, emailid, idprof_name, id_prof, dob, gender, health_problem, blood_group, subpackage_name,
            start_date, end_date, status, participants } = req.body;

        if (plainText.length < 5) {
            return res.json({
                status: "error",
                error: " Password too small. Should be atleast 6 Characters."
            });
        }

        try {

            const newpassword = await bcrypt.hash(plainText, 10);

            await prisma.registration.update({
                where: {
                    id: registration.id,
                },
                data: {
                    name: name,
                    mobileno: mobileno,
                    emailid: emailid,
                    idprof_name: idprof_name,
                    id_prof: id_prof,
                    dob: dob,
                    gender: gender,
                    password: newpassword,
                    health_problem: health_problem,
                    blood_group: blood_group,
                    subpackage_name: subpackage_name,
                    start_date: start_date,
                    end_date: end_date,
                    status: status,

                    participants: {
                        create: participants
                    },

                    package_id: req.package_id,
                    user_id: req.user_id
                }
            });

            res.json({ status: "Your Details Updated Successfully." });
        } catch (error) {
            console.log(error);
            res.json({ status: "error", error: "Please Check Your Details." })
        }
    }*/
};
