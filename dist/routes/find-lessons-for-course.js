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
        const courseId = request.params.courseId, query = request.query, pageNumber = query?.pageNumber ?? "0", pageSize = query?.pageSize ?? "3";
        if (!(0, utils_1.isInteger)(courseId)) {
            throw `Invalid course id ${courseId}`;
        }
        if (!(0, utils_1.isInteger)(pageNumber)) {
            throw `Invalid pageNumber ${pageNumber}`;
        }
        if (!(0, utils_1.isInteger)(pageSize)) {
            throw `Invalid pageSize ${pageSize}`;
        }
        const lessons = await data_source_1.AppDataSource.getRepository(lesson_1.Lesson)
            .createQueryBuilder("lessons")
            .where("lessons.courseId = :courseId", { courseId })
            .orderBy("lessons.seqNo")
            .skip(pageNumber * pageSize)
            .take(pageSize)
            .getMany();
        response.status(200).json({ lessons });
    }
    catch (error) {
        logger_1.logger.error(`Error calling findLessonsForCourse()`);
        return next(error);
    }
}
