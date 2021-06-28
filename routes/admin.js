var express = require("express");
const AdminController = require("../controllers/AdminController");
const AboutUsController = require("../controllers/AboutUsController");
const BlogController = require("../controllers/BlogController");
const ContactUsController = require("../controllers/ContactUsController");
// const CampController = require("../controllers/CampController");
// const HomeController = require("../controllers/HomeController");

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
const aboutusController = new AboutUsController();
const blogController = new BlogController();
const contactusController = new ContactUsController();
// const campController = new CampController();
// const homeController = new homeController();

// Create admin
router.post("/register", (req, res) => adminController.register(req, res));

// login
router.post("/login", (req, res) => adminController.login(req, res));

// change password
router.post("/changepassword", (req, res) =>
  adminController.changepassword(req, res)
);

// Create aboutUs
router.post("/createaboutus", (req, res) =>
  aboutusController.createAboutUs(req, res)
);

// Get aboutUs
router.get("/getaboutus", (req, res) => aboutusController.getAboutUs(req, res));

// Create blog
router.post("/createblog", (req, res) => blogController.createBlog(req, res));

// Update blog
router.post("/updateblog", (req, res) => blogController.updateBlog(req, res));

// Get blog
router.get("/getblog", (req, res) => blogController.getBlog(req, res));

// Create contactUs
router.post("/createcontactus", (req, res) =>
  contactusController.createContactUs(req, res)
);

// Get ContactUs
router.get("/getcontactus", (req, res) =>
  contactusController.getContactUs(req, res)
);

module.exports = router;
