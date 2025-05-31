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
        const course = await data_source_1.AppDataSource.getRepository(course_1.Course).findOneBy({
            url: courseUrl,
        });
        if (!course) {
            const message = `Could not find a course with url ${courseUrl}`;
            logger_1.logger.error(message);
            response.status(404).json({ message });
            return;
        }
        const totalLessons = await data_source_1.AppDataSource.getRepository(lesson_1.Lesson)
            .createQueryBuilder("lessons")
            .where("lessons.courseId = :courseId", {
            courseId: course.id,
        })
            .getCount();
        response.status(200).json({
            course,
            totalLessons,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error calling findCourseByUrl()`);
        return next(error);
    }
}
