const users = require("express").Router();

const { getProfile, updateUser } = require("../controllers/users");

const { validationUpdateUser } = require("../utils/validations");

users.get("/me", getProfile);

users.patch("/me", validationUpdateUser, updateUser);

module.exports = users;
