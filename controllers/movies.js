const Movie = require("../models/movie");

const { BadRequestError, ForbiddenError, NotFoundError } = require("../errors");

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
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
    movieId } = req.body;
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
            throw new BadRequestError("Переданы некорректные данные");
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
        throw new NotFoundError("Отсутствует удаляемый фильм");
      }
      if (userId !== String(movie.owner._id)) {
        throw new ForbiddenError("Нельзя удалять чужие фильмы");
      }
      return Movie.findByIdAndRemove(movieId)
        .orFail(() => {
          throw new NotFoundError("Отсутствует удаляемый фильм");
        })
        .then((movie) => res.send(movie))
        .catch((err) => {
          if (err.name === "ValidationError" || err.name === "CastError") {
            throw new BadRequestError("Переданы некорректные данные");
          }
          throw new NotFoundError(err.message);
        })
        .catch(next);
    })
    .catch(next);
};
