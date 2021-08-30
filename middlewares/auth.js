const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../errors");

const { JWT_SECRET_KEY = "SUPER_SECRET_KEY" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  req.user = payload;

  next();
};