const movies = require("express").Router();

const {
  getMovies,
  createMovie,
} = require("../controllers/movies");

const {
  validationCreateMovie,
} = require("../utils/validations");

movies.get("/", getMovies);

movies.post("/", validationCreateMovie, createMovie);

movies.delete("/:movieId");

module.exports = movies;
