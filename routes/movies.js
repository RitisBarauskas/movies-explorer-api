const movies = require("express").Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

// const {
//   validationUserID,
//   validationUpdateAvatar,
//   validationUpdateUser,
// } = require("../utils/validations");

movies.get("/movies", getMovies);

movies.post("/movies", createMovie);

movies.delete("/movies/:movieID", deleteMovie);

module.exports = movies;