var express = require("express");
const AdminController = require("../controllers/AdminController");

var router = express.Router();

var multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + ".png");
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const adminController = new AdminController();

// Create marksheet
router.post("/register", (req, res) => adminController.register(req, res));

// login
router.get("/login", (req, res) => adminController.login(req, res));

// change password
router.post("/changepassword", (req, res) =>
  adminController.changepassword(req, res)
);

module.exports = router;
