const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const path = require("path");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const globalErrorHandler = require("./controllers/errorController");
const collectionRouter = require("./routes/collectionRoutes");
const itemRouter = require("./routes/itemRoutes");
const AppError = require("./utils/appError");

const app = express();

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 60,
  windowMs: 60 * 1000,
  message: "To many requests from this IP, please try again in an hour",
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data Sanitization angainst XSS attacks
app.use(xss());

// Compression middleware
app.use(compression());

app.use("/api", limiter);
app.use("/api/v1/collections", collectionRouter);
app.use("/api/v1/items", itemRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
