import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";
import { Lesson } from "../models/lesson";

export async function findCourseByUrl(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called findCourseByUrl()`);

    const courseUrl = request.params.courseUrl;

    if (!courseUrl) {
      throw `Could not extract the course url from the request.`;
    }

    // Attempt to find the course in the database by its URL
    const course = await AppDataSource.getRepository(Course).findOneBy({
      url: courseUrl,
    });

    // If no course is found, return a 404 response
    if (!course) {
      const message = `Could not find a course with url ${courseUrl}`;
      logger.error(message);
      response.status(404).json({ message });
      return;
    }

    // Count the number of lessons associated with the found course
    const totalLessons = await AppDataSource.getRepository(Lesson)
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
  } catch (error) {
    // Log and forward the error to the error handling middleware
    logger.error(`Error calling findCourseByUrl()`);
    return next(error);
  }
}
