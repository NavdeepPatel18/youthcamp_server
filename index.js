const express = require("express");
const bodyParser = require("body-parser");
var path = require("path");

const cors = require("cors");

const isAuth = require("./middleware/is-auth");
const adminRouter = require("./routes/admin");

const port = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type, Authorization,Origin, X-Requested-With,Accept"
  );
  // res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPITIONS");
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log("Server up at " + port);
});
