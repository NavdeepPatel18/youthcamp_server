var express = require("express");
const AdminController = require("../controllers/AdminController");
const AboutUsController = require("../controllers/AboutUsController");
const BlogController = require("../controllers/BlogController");
const ContactUsController = require("../controllers/ContactUsController");
const CampController = require("../controllers/CampController");
const HomeController = require("../controllers/HomeController");

var router = express.Router();
var multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    if (file.originalname.length > 6)
      cb(
        null,
        file.fieldname +
          "-" +
          Date.now() +
          file.originalname.substr(
            file.originalname.length - 6,
            file.originalname.length
          )
      );
    else cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
  // filename: function (req, file, cb) {
  //   cb(null, file.fieldname + Date.now() + ".png");
  // },
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
const campController = new CampController();
const homeController = new HomeController();

// Create admin
router.post("/register", (req, res) => adminController.register(req, res));

// login
router.post("/login", (req, res) => adminController.login(req, res));

// change password
router.post("/changepassword", (req, res) =>
  adminController.changepassword(req, res)
);

// Create aboutUs
router.post("/createaboutus", upload.single("aboutusphoto"), (req, res) =>
  aboutusController.createAboutUs(req, res)
);

// Get aboutUs
router.get("/getaboutus", (req, res) => aboutusController.getAboutUs(req, res));

// Create blog
router.post("/createblog", upload.single("blogphoto"), (req, res) =>
  blogController.createBlog(req, res)
);

// Update blog
router.post("/updateblog/:id", upload.single("blogphoto"), (req, res) =>
  blogController.updateBlog(req, res)
);

// Get blog
router.get("/getblog", (req, res) => blogController.getBlog(req, res));

// Delete blog
router.delete("/deleteblog/:id", (req, res) =>
  blogController.deleteBlog(req, res)
);

// Create contactUs
router.post(
  "/createcontactus",
  upload.array("teamMemberPhoto", 10),
  (req, res) => contactusController.createContactUs(req, res)
);

// Get ContactUs
router.get("/getcontactus", (req, res) =>
  contactusController.getContactUs(req, res)
);

// Create teamMember
router.post("/addteam/:id", upload.single("teamMemberPhoto"), (req, res) =>
  contactusController.addTeamMember(req, res)
);

// delete teamMember
router.delete("/deleteteam/:id", (req, res) =>
  contactusController.deleteTeamMember(req, res)
);

// Create Home
router.post(
  "/createhome",
  upload.fields([
    { name: "homephoto", maxCount: 1 },
    { name: "hometitlephoto", maxCount: 1 },
  ]),
  (req, res) => homeController.createHomePage(req, res)
);

// Get Home
router.get("/gethome", (req, res) => homeController.getHomePage(req, res));

// Create TravelQuotes
router.post("/addtravelquotes/:id", upload.single("photo"), (req, res) =>
  homeController.addTravelQuotes(req, res)
);

// Create TravelStories
router.post("/addtravelstories/:id", upload.single("photo"), (req, res) =>
  homeController.addTravelStories(req, res)
);

// delete TravelQuotes
router.delete("/deletetravelquotes/:id", (req, res) =>
  homeController.deleteTravelQuotes(req, res)
);

// delete TravelStories
router.delete("/deletetravelstories/:id", (req, res) =>
  homeController.deleteTravelStories(req, res)
);

// Create Camp
router.post(
  "/createcamp",
  upload.fields([
    { name: "basicphoto", maxCount: 2 },
    { name: "packagephoto" },
    { name: "schedulephoto" },
  ]),
  (req, res) => campController.createCamp(req, res)
);

// add CampDate
router.post("/addcampdate/:id", (req, res) =>
  campController.addCampDate(req, res)
);

// add Package
router.post(
  "/addpackage/:id",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  (req, res) => campController.addPackage(req, res)
);

// add Schedule
router.post(
  "/addschedule/:id",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  (req, res) => campController.addSchedule(req, res)
);

// add CampOtherDetail
router.post("/addcampotherdetail/:id", (req, res) =>
  campController.addOtherDetail(req, res)
);

// add FAQS
router.post("/addfaqs/:id", (req, res) => campController.addFAQS(req, res));

// Update Camp
router.post(
  "/updatecamp/:id",
  upload.fields([{ name: "basicphoto", maxCount: 2 }]),
  (req, res) => campController.updateCamp(req, res)
);

// Get Camp
router.get("/getcamp", (req, res) => campController.getCamp(req, res));

// delete camp
router.delete("/deletecamp/:id", (req, res) =>
  campController.deletecamp(req, res)
);

// delete CampDate
router.delete("/deletecampdate/:id", (req, res) =>
  campController.deleteCampDate(req, res)
);

// delete package
router.delete("/deletepackage/:id", (req, res) =>
  campController.deletePackage(req, res)
);

// delete schedule
router.delete("/deleteschedule/:id", (req, res) =>
  campController.deleteSchedule(req, res)
);

// delete camp otherdetail
router.delete("/deletecampotherdetail/:id", (req, res) =>
  campController.deleteCampOtherDetail(req, res)
);

// delete campfaqs
router.delete("/deletecampfaqs/:id", (req, res) =>
  campController.deleteCampFAQS(req, res)
);

module.exports = router;
