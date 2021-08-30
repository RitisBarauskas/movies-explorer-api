const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  BadRequestError,
  NotFoundError,
} = require("../errors");


module.exports.getProfile = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
      throw new NotFoundError(err.message);
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
      throw new NotFoundError("Пользователь с таким ID не найден");
    })
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

