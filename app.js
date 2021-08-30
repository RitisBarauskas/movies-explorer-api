const express = require("express");
const { errors } = require("celebrate");

const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const movies = require("./routes/movies");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { validationSignIn, validationSignUp } = require("./utils/validations");
const { handleError } = require("./middlewares/handleError");
const { notFoundPage } = require("./middlewares/notFoundPage");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

mongoose.connect("mongodb://localhost:27017/bitfilmdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});
app.post("/signin", validationSignIn, login);
app.post("/signup", validationSignUp, createUser);

app.use(auth);
app.use("/users", users);
app.use("/movies", movies);

app.use(errorLogger);
app.use(errors());
app.get("*", notFoundPage);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
