const movies = require("express").Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

const {
  validationCreateMovie,
} = require("../utils/validations");

movies.get("/movies", getMovies);

movies.post("/movies", validationCreateMovie, createMovie);

movies.delete("/movies/:movieID", deleteMovie);

module.exports = movies;