const Movie = require("../models/movie");

const { BadRequestError, ForbiddenError, NotFoundError } = require("../errors");

const {
  NO_CORRECT_DATA,
  FILM_NOT_FOUND,
  NO_DEL_NOT_OWNER_FILM,
  NOT_FOUND_DEL_FILM,
} = require("../utils/constants");

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      return Movie.findById(movie._id)
        .then((movie) => res.send(movie))
        .catch((err) => {
          if (err.name === "ValidationError" || err.name === "CastError") {
            throw new BadRequestError(NO_CORRECT_DATA);
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(FILM_NOT_FOUND);
      }
      if (userId !== String(movie.owner._id)) {
        throw new ForbiddenError(NO_DEL_NOT_OWNER_FILM);
      }
      return Movie.findByIdAndRemove(movie._id)
        .orFail(() => {
          throw new NotFoundError(NOT_FOUND_DEL_FILM);
        })
        .then((movie) => res.send(movie))
        .catch((err) => {
          if (err.name === "ValidationError" || err.name === "CastError") {
            throw new BadRequestError(NO_CORRECT_DATA);
          }
          throw new NotFoundError(FILM_NOT_FOUND);
        })
        .catch(next);
    })
    .catch(next);
};
