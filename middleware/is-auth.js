const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log("Authorization \t" + authHeader);
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[0];
  console.log("\n token \t" + token);
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      token,
      "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk"
    );
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  req.userName = decodedToken.userName;
  req.userType = decodedToken.userType;

  console.log(
    "\n isAuth \t" +
      req.isAuth +
      "\n decoded userid \t" +
      decodedToken.userId +
      "\n decoded usertype \t" +
      decodedToken.userType
  );

  next();
};
