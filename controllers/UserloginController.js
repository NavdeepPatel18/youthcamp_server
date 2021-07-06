const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { OAuth2Client } = require("google-auth-library");

const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const prisma = new PrismaClient();

const client = new OAuth2Client(
  "458737510452-787oh2it2510hn3eocquabiq3gia9u5i.apps.googleusercontent.com"
);

const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

module.exports = class AdminController extends BaseController {
  async googlelogin(req, res) {
    const { tokenId } = req.body;

    // res.json({ status: "ok", data: req.body });
    try {
      const user = await client.verifyIdToken({
        idToken: tokenId,
        audience:
          "458737510452-787oh2it2510hn3eocquabiq3gia9u5i.apps.googleusercontent.com",
      });

      const { email_verified, name, email, picture } = user.payload;

      console.log(email_verified, name, email, picture);

      console.log(user.payload);

      if (email_verified) {
        const findData = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        console.log(findData);

        if (findData) {
          const token = jwt.sign(
            {
              userId: user.id,
              userType: "USER",
            },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
          return this.sendJSONResponse(
            res,
            null,
            {
              length: 1,
            },
            { token, findData }
          );
        } else {
          try {
            const addUser = await prisma.user.create({
              data: {
                name: name,
                email: email,
                photo: picture,
              },
            });
            console.log(addUser);
          } catch (err) {
            console.log(err);
          }

          if (addUser) {
            const token = jwt.sign(
              {
                userId: addUser.id,
                userType: "USER",
              },
              JWT_SECRET,
              { expiresIn: "1h" }
            );
            return this.sendJSONResponse(
              res,
              null,
              {
                length: 1,
              },
              { token, addUser }
            );
          } else {
            res.json({ status: "error", error: "error" });
          }
        }
      } else {
        res.json({ status: "error", error: "email is not verified !" });
      }
    } catch (err) {
      console.log(err);
      res.json({ status: "error", error: "Some thing went wrong" });
    }
  }
};
