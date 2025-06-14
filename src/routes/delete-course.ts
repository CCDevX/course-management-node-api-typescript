import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { isInteger } from "../utils";
import { AppDataSource } from "../data-source";
import { Lesson } from "../models/lesson";
import { Course } from "../models/course";

export async function deleteCourseAndLessons(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called deleteCourseAndLessons()`);

    const courseId = request.params.courseId;

    // Validate that the courseId is an integer
    if (!isInteger(courseId)) {
      throw `Invalid courseId ${courseId}`;
    }

    // Run both deletions within a database transaction to ensure consistency
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // First, delete all lessons associated with the course
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Lesson)
          .where("courseId = :courseId", { courseId })
          .execute();

        // Then, delete the course itself
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Course)
          .where("id = :courseId", { courseId })
          .execute();
      }
    );

    // If everything succeeds, send a success response
    response.status(200).json({
      message: `Course deleted successfully ${courseId}`,
    });
  } catch (error) {
    // Log and forward any error that occurs during the operation
    logger.error(`Error calling deleteCourseAndLessons()`);
    return next(error);
  }
}
