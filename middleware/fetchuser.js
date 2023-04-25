const jwt = require("jsonwebtoken");
const JWT_SECRET = "hello";
const User = require("../models/farmer");

const fetchuser = async (req, res, next) => {
  // get the user from the jwt token and id to req obj
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "Plese Authenticate using a valid token" });
    return;
  }
  try {
  
    const data = jwt.verify(token, JWT_SECRET);
    console.log(data)
    // const userId = data.user.id;
    req.user = data;
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};
module.exports = fetchuser;