const movies = require("express").Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

const {
  validationCreateMovie,
  validationDeleteMovie,
} = require("../utils/validations");

movies.get("/", getMovies);

movies.post("/", validationCreateMovie, createMovie);

movies.delete("/:movieId", validationDeleteMovie, deleteMovie);

module.exports = movies;
