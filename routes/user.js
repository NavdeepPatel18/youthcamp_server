var express = require("express");
const UserloginController = require("../controllers/UserloginController");
const RegistrationController = require("../controllers/RegistrationController");

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

const userloginController = new UserloginController();
const registrationController = new RegistrationController();

// User Login
router.post("/googlelogin", (req, res) =>
  userloginController.googlelogin(req, res)
);

//Registration
router.post(
  "/registration",
  upload.fields([
    { name: "id_prof1", maxCount: 1 },
    { name: "id_prof2", maxCount: 1 },
  ]),
  (req, res) => registrationController.registration(req, res)
);

// Add Participate
router.post(
  "/addparticipate/:id",
  upload.fields([
    { name: "id_prof1", maxCount: 1 },
    { name: "id_prof2", maxCount: 1 },
  ]),
  (req, res) => registrationController.addParticipate(req, res)
);

// Get Registration
router.get("/getregistration", (req, res) =>
  registrationController.getRegistration(req, res)
);

module.exports = router;
