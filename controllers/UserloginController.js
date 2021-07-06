const bcrypt = require("bcryptjs");
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

    const user = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "458737510452-787oh2it2510hn3eocquabiq3gia9u5i.apps.googleusercontent.com",
    });

    const { email_verified, name, email, picture } = user;

    if (email_verified) {
      try {
        const findData = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (findData) {
          const token = jwt.sign(
            {
              userId: user.id,
              userType: "USER",
            },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
          return res.json({ status: "ok", data: token, userData: findData });
        } else {
          const addUser = await prisma.user.create({
            data: {
              name: name,
              email: email,
              photo: picture,
            },
          });
          if (addUser) {
            const token = jwt.sign(
              {
                userId: addUser.id,
                userType: "USER",
              },
              JWT_SECRET,
              { expiresIn: "1h" }
            );
            return res.json({ status: "ok", data: token, userData: addUser });
          } else {
            res.json({ status: "error", error: "Some thing went wrong" });
          }
        }
      } catch (err) {
        res.json({ status: "error", error: "Some thing went wrong" });
      }
    } else {
      res.json({ status: "error", error: "email is not verified !" });
    }
  }
};
