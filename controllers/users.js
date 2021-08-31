const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../errors");

const {
  NO_CORRECT_DATA,
  USER_NOT_FOUND,
  PROFILE_NOT_FOUND,
  EMAIL_OR_PASS_NOT_EXIST,
  USER_EMAIL_EXIST,
  EMAIL_OR_PASS_NOT_CORRECT,
  USER_WITH_EMAIL_NOT_FOUND,
  PASS_NOT_CORRECT,
} = require("../utils/constants");


const { JWT_SECRET_KEY = "SUPER_SECRET_KEY" } = process.env;

module.exports.getProfile = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND);
    })
    .then((user) =>
      res.send({
        email: user.email,
        name: user.name,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError(NO_CORRECT_DATA);
      }
      throw new NotFoundError(PROFILE_NOT_FOUND);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(
    owner,
    { email, name },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND);
    })
    .then((user) =>
      res.send({
        email: user.email,
        name: user.name,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError(NO_CORRECT_DATA);
      }
      throw new NotFoundError(PROFILE_NOT_FOUND);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError(EMAIL_OR_PASS_NOT_EXIST);
  }
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
      })
    )
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.name === "MongoError" || err.code === 11000) {
        throw new ConflictError(USER_EMAIL_EXIST);
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError(EMAIL_OR_PASS_NOT_CORRECT);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError(EMAIL_OR_PASS_NOT_EXIST);
  }
  User.findOne({ email })
    .select("+password")
    .orFail(() => {
      throw new UnauthorizedError(USER_WITH_EMAIL_NOT_FOUND);
    })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          return next(new UnauthorizedError(PASS_NOT_CORRECT));
        }
        const userToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        res.send({ token: userToken });
      });
    })
    .catch(next);
};
