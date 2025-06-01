"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCourseByUrl = findCourseByUrl;
const logger_1 = require("../logger");
const data_source_1 = require("../data-source");
const course_1 = require("../models/course");
const lesson_1 = require("../models/lesson");
async function findCourseByUrl(request, response, next) {
    try {
        logger_1.logger.debug(`Called findCourseByUrl()`);
        const courseUrl = request.params.courseUrl;
        if (!courseUrl) {
            throw `Could not extract the course url from the request.`;
        }
        // Attempt to find the course in the database by its URL
        const course = await data_source_1.AppDataSource.getRepository(course_1.Course).findOneBy({
            url: courseUrl,
        });
        // If no course is found, return a 404 response
        if (!course) {
            const message = `Could not find a course with url ${courseUrl}`;
            logger_1.logger.error(message);
            response.status(404).json({ message });
            return;
        }
        // Count the number of lessons associated with the found course
        const totalLessons = await data_source_1.AppDataSource.getRepository(lesson_1.Lesson)
            .createQueryBuilder("lessons")
            .where("lessons.courseId = :courseId", {
            courseId: course.id,
        })
            .getCount();
        // Send the course and the total number of lessons as JSON response
        response.status(200).json({
            course,
            totalLessons,
        });
    }
    catch (error) {
        // Log and forward the error to the error handling middleware
        logger_1.logger.error(`Error calling findCourseByUrl()`);
        return next(error);
    }
}
