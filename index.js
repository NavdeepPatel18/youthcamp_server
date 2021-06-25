const express = require("express");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");

const port = process.env.port || 3001;
const app = express();
app.use(bodyParser.json());

app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log("Server up at 3001");
});
