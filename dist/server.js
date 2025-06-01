"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const result = dotenv_1.default.config();
if (result.error) {
    console.log("Error loading environment variables aborting.");
    process.exit(1);
}
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const root_1 = require("./routes/root");
const utils_1 = require("./utils");
const logger_1 = require("./logger");
const data_source_1 = require("./data-source");
const get_all_courses_1 = require("./routes/get-all-courses");
const default_error_handler_1 = require("./middlewares/default-error-handler");
const find_course_by_url_1 = require("./routes/find-course-by-url");
const find_lessons_for_course_1 = require("./routes/find-lessons-for-course");
const update_course_1 = require("./routes/update-course");
const create_course_1 = require("./routes/create-course");
const delete_course_1 = require("./routes/delete-course");
const create_user_1 = require("./routes/create-user");
const login_1 = require("./routes/login");
const authentication_middleware_1 = require("./middlewares/authentication-middleware");
const admin_only_middleware_1 = require("./middlewares/admin-only.middleware");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = (0, express_1.default)();
function setupExpress() {
    app.use(cors({ origin: true }));
    app.use(bodyParser.json());
    app.route("/").get(root_1.root);
    app.route("/api/courses").get(authentication_middleware_1.checkIfAuthenticated, get_all_courses_1.getAllCourses);
    app
        .route("/api/courses/:courseUrl")
        .get(authentication_middleware_1.checkIfAuthenticated, find_course_by_url_1.findCourseByUrl);
    app
        .route("/api/courses/:courseId/lessons")
        .get(authentication_middleware_1.checkIfAuthenticated, find_lessons_for_course_1.findLessonsForCourse);
    app.route("/api/courses/:courseId").patch(authentication_middleware_1.checkIfAuthenticated, update_course_1.updateCourse);
    app.route("/api/courses").post(authentication_middleware_1.checkIfAuthenticated, create_course_1.createCourse);
    app
        .route("/api/courses/:courseId")
        .delete(authentication_middleware_1.checkIfAuthenticated, delete_course_1.deleteCourseAndLessons);
    app.route("/api/users").post(authentication_middleware_1.checkIfAuthenticated, admin_only_middleware_1.checkIfAdmin, create_user_1.createUser);
    app.route("/api/login").post(login_1.login);
    app.use(default_error_handler_1.defaultErrorHandler);
}
function startServer() {
    const portArg = process.env.PORT ?? process.argv[2];
    let port = (0, utils_1.isInteger)(portArg) ? parseInt(portArg) : 9000;
    app.listen(port, () => {
        logger_1.logger.info(`HTTP REST API Server is now running at http://localhost:${port}`);
    });
}
data_source_1.AppDataSource.initialize()
    .then(() => {
    logger_1.logger.info("Database connection established successfully.");
    setupExpress();
    startServer();
})
    .catch((error) => {
    logger_1.logger.error("Error during Data Source initialization:", error);
    process.exit(1);
});
