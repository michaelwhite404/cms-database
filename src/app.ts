import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import compression from "compression";
import rateLimit from "express-rate-limit";

import AppError from "./utils/appError";
import collectionRouter from "./routes/collectionRoutes";
import databaseRouter from "./routes/databaseRoutes";
import userRouter from "./routes/userRoutes";
import globalErrorHandler from "./controllers/errorController";

const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

/** Limits requests from same API (Options)*/
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
app.use("/api/v1/databases", databaseRouter);
app.use("/api/v1/users", userRouter);

// If url is not found
app.all("*", (req, _, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
