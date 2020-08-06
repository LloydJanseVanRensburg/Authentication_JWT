const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized, Access Denied" });
  }

  try {
    const decodedToken = jwt.verify(authHeader, config.get("JWT_SECRET"));

    req.userId = decodedToken.user._id;

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized, Access Denied" });
  }
};
