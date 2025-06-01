import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";

/*
 *
 * curl -X POST http://localhost:9000/api/courses -H "Content-Type:application/json" -d '{"url": "firebase-bootcamp", "title": "Firebase Bootcamp", "iconUrl": "https://angular-university.s3-us-west-1.amazonaws.com/course-images/firebase-course-1.jpg","longDescription": "Complete guided tour to the Firebase ecosystem.", "category": "BEGINNER"}'
 *
 * {"url": "firebase-bootcamp", "title": "Firebase Bootcamp", "iconUrl": "https://angular-university.s3-us-west-1.amazonaws.com/course-images/firebase-course-1.jpg","longDescription": "Complete guided tour to the Firebase ecosystem.", "category": "BEGINNER"}
 *
 * */

export async function createCourse(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called createCourse()`);

    const data = request.body;

    if (!data) {
      throw `No data available, cannot save course.`;
    }

    // Start a database transaction with REPEATABLE READ isolation level
    const course = await AppDataSource.manager.transaction(
      "REPEATABLE READ",
      async (transactionalEntityManager) => {
        const repository = transactionalEntityManager.getRepository(Course);

        // Find the current maximum seqNo to assign the next sequential number
        const result = await repository
          .createQueryBuilder("courses")
          .select("MAX(courses.seqNo)", "max")
          .getRawOne();

        // Create a new Course instance with incremented seqNo
        const course = repository.create({
          ...data,
          seqNo: (result?.max ?? 0) + 1,
        });

        // Save the new course inside the transaction
        await repository.save(course);

        return course;
      }
    );

    // Respond with the newly created course
    response.status(200).json({ course });
  } catch (error) {
    // Log and forward the error to the error-handling middleware
    logger.error(`Error calling createCourse()`);
    return next(error);
  }
}
