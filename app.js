const express = require("express");
require("express-async-errors");
const cors = require("cors");
const connectToDatabase = require("./utils/database");
const middleware = require("./utils/middleware");

const usersRouter = require("./controllers/users");
const blogsRouter = require("./controllers/blogs");

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
