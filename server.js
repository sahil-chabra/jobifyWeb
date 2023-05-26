import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import morgan from "morgan";
import notFoundMiddleWare from "./middleware/not-found.js";
import errorHandlerMiddleWare from "./middleware/error-handler.js";
import connectDB from "./db/connect.js";
import authRouter from "./routes/authRoute.js";
import jobRouter from "./routes/jobRoute.js";
import authenticateUser from "./middleware/auth.js";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import rateLimiter from "express-rate-limit";
import cookieParser from "cookie-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const app = express();

dotenv.config();
if (process.env.NODE_ENVIRONMENT !== "production") {
  app.use(morgan("dev"));
}
app.use("/api", apiLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "./client/build")));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);
const port = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URL.replace(
  "<password>",
  process.env.MONGO_PASSWORD
);

const start = async () => {
  try {
    await connectDB(mongoURI)
      .then(() => {
        console.log("connected DB successfully");
      })
      .catch((err) => console.log(err));
    app.listen(port, () => {
      console.log("listening on port .." + port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
