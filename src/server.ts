import dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.log("Error loading environment variables aborting.");
  process.exit(1);
}

import "reflect-metadata";
import express from "express";
import { root } from "./routes/root";
import { isInteger } from "./utils";
import { logger } from "./logger";
import { AppDataSource } from "./data-source";
import { getAllCourses } from "./routes/get-all-courses";
import { defaultErrorHandler } from "./middlewares/default-error-handler";
import { findCourseByUrl } from "./routes/find-course-by-url";
import { findLessonsForCourse } from "./routes/find-lessons-for-course";

const cors = require("cors");

const app = express();

function setupExpress() {
  app.use(cors({ origin: true }));
  app.route("/").get(root);
  app.route("/api/courses").get(getAllCourses);
  app.route("/api/courses/:courseUrl").get(findCourseByUrl);
  app.route("/api/courses/:courseId/lessons").get(findLessonsForCourse);
  app.use(defaultErrorHandler);
}

function startServer() {
  const portArg = process.env.PORT ?? process.argv[2];

  let port: number = isInteger(portArg) ? parseInt(portArg) : 9000;

  app.listen(port, () => {
    logger.info(
      `HTTP REST API Server is now running at http://localhost:${port}`
    );
  });
}

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established successfully.");
    setupExpress();
    startServer();
  })
  .catch((error) => {
    logger.error("Error during Data Source initialization:", error);
    process.exit(1);
  });
