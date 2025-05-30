"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourses = getAllCourses;
const logger_1 = require("../logger");
const data_source_1 = require("../data-source");
const course_1 = require("../models/course");
// Express route handler to fetch all courses from the database
async function getAllCourses(request, response, next) {
    try {
        logger_1.logger.debug(`Called getAllCourses()`);
        // Fetch all courses using TypeORM's QueryBuilder
        // - Get the repository for the Course entity
        // - Create a query builder aliasing the table as "courses"
        // - Order the results by the 'seqNo' field
        // - Execute the query and return all matching records
        const courses = await data_source_1.AppDataSource.getRepository(course_1.Course)
            .createQueryBuilder("courses")
            .orderBy("courses.seqNo")
            .getMany();
        // Send the list of courses back to the client with a 200 OK status
        response.status(200).json({ courses });
    }
    catch (error) {
        // Log the error message
        logger_1.logger.error(`Error calling getAllCourses()`);
        return next(error);
    }
}
