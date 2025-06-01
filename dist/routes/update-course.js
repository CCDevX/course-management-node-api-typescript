"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourse = updateCourse;
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const data_source_1 = require("../data-source");
const course_1 = require("../models/course");
/*
 *
 * curl -X PATCH http://localhost:9000/api/courses/76 -H "Content-Type:application/json" -d '{"title":"Typescript Bootcamp v2"}'
 *
 **/
async function updateCourse(request, response, next) {
    try {
        logger_1.logger.debug(`Called updateCourse()`);
        const courseId = request.params.courseId, changes = request.body;
        if (!(0, utils_1.isInteger)(courseId)) {
            throw `Invalid course id ${courseId}`;
        }
        // Use TypeORM's query builder to update the course with the specified changes
        await data_source_1.AppDataSource.createQueryBuilder()
            .update(course_1.Course) // Target the Course entity
            .set(changes) // Apply the changes provided in the request body
            .where("id = :courseId", { courseId }) // Apply the update only to the course with this ID
            .execute(); // Execute the SQL UPDATE query
        // Return a success message to the client
        response.status(200).json({
            message: `Course ${courseId} was updated successfully.`,
        });
    }
    catch (error) {
        // Log and forward any error to the Express error handler
        logger_1.logger.error(`Error calling updateCourse()`);
        return next(error);
    }
}
