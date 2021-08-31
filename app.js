const express = require("express");
const { errors } = require("celebrate");
const helmet = require("helmet");

const { PORT = 3000, DATABASE = "mongodb://localhost:27017/moviesdb" } =
  process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { handleError } = require("./middlewares/handleError");
const { notFoundPage } = require("./middlewares/notFoundPage");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

mongoose.connect(`${DATABASE}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(requestLogger);

app.use("/", indexRouter);

app.use(errorLogger);
app.use(errors());
app.get("*", notFoundPage);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
