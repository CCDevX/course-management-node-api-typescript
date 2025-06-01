"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLessonsForCourse = findLessonsForCourse;
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const data_source_1 = require("../data-source");
const lesson_1 = require("../models/lesson");
async function findLessonsForCourse(request, response, next) {
    try {
        logger_1.logger.debug(`Called findLessonsForCourse()`);
        // Extract courseId from route parameters
        const courseId = request.params.courseId, 
        // Extract pagination query parameters from the URL
        query = request.query, pageNumber = query?.pageNumber ?? "0", // default to page 0
        pageSize = query?.pageSize ?? "3"; // default to 3 lessons per page
        if (!(0, utils_1.isInteger)(courseId)) {
            throw `Invalid course id ${courseId}`;
        }
        if (!(0, utils_1.isInteger)(pageNumber)) {
            throw `Invalid pageNumber ${pageNumber}`;
        }
        if (!(0, utils_1.isInteger)(pageSize)) {
            throw `Invalid pageSize ${pageSize}`;
        }
        // Query the Lesson repository to retrieve lessons for the given course
        const lessons = await data_source_1.AppDataSource.getRepository(lesson_1.Lesson)
            .createQueryBuilder("lessons")
            .where("lessons.courseId = :courseId", { courseId }) // filter by courseId
            .orderBy("lessons.seqNo") // sort by sequence number
            .skip(pageNumber * pageSize) // skip results for previous pages
            .take(pageSize) // limit number of results per page
            .getMany(); // execute query and return results
        // Return the paginated list of lessons as a JSON response
        response.status(200).json({ lessons });
    }
    catch (error) {
        // Log and forward any error to the Express error handler
        logger_1.logger.error(`Error calling findLessonsForCourse()`);
        return next(error);
    }
}
