const express = require("express");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");

const app = express();
app.use(bodyParser.json());

app.use("/admin", adminRouter);

app.listen(3001, () => {
  console.log("Server up at 3001");
});
