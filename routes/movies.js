const movies = require("express").Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

const {
  validationCreateMovie,
} = require("../utils/validations");

movies.get("/", getMovies);

movies.post("/", validationCreateMovie, createMovie);

movies.delete("/:movieID", deleteMovie);

module.exports = movies;