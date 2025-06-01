"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseAndLessons = deleteCourseAndLessons;
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const data_source_1 = require("../data-source");
const lesson_1 = require("../models/lesson");
const course_1 = require("../models/course");
async function deleteCourseAndLessons(request, response, next) {
    try {
        logger_1.logger.debug(`Called deleteCourseAndLessons()`);
        const courseId = request.params.courseId;
        // Validate that the courseId is an integer
        if (!(0, utils_1.isInteger)(courseId)) {
            throw `Invalid courseId ${courseId}`;
        }
        // Run both deletions within a database transaction to ensure consistency
        await data_source_1.AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            // First, delete all lessons associated with the course
            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from(lesson_1.Lesson)
                .where("courseId = :courseId", { courseId })
                .execute();
            // Then, delete the course itself
            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from(course_1.Course)
                .where("id = :courseId", { courseId })
                .execute();
        });
        // If everything succeeds, send a success response
        response.status(200).json({
            message: `Course deleted successfully ${courseId}`,
        });
    }
    catch (error) {
        // Log and forward any error that occurs during the operation
        logger_1.logger.error(`Error calling deleteCourseAndLessons()`);
        return next(error);
    }
}
