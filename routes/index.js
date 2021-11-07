const indexRouter = require("express").Router();

const users = require("./users");
const movies = require("./movies");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validationSignIn, validationSignUp } = require("../utils/validations");

indexRouter.post("/signin", validationSignIn, login);
indexRouter.post("/signup", validationSignUp, createUser);

indexRouter.use(auth);
indexRouter.use("/users", users);
indexRouter.use("/movies", movies);

module.exports = indexRouter;
