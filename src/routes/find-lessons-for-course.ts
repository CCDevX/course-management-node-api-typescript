import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { isInteger } from "../utils";
import { AppDataSource } from "../data-source";
import { Lesson } from "../models/lesson";

export async function findLessonsForCourse(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called findLessonsForCourse()`);

    // Extract courseId from route parameters
    const courseId = request.params.courseId,
      // Extract pagination query parameters from the URL
      query = request.query as any,
      pageNumber = query?.pageNumber ?? "0", // default to page 0
      pageSize = query?.pageSize ?? "3"; // default to 3 lessons per page

    if (!isInteger(courseId)) {
      throw `Invalid course id ${courseId}`;
    }

    if (!isInteger(pageNumber)) {
      throw `Invalid pageNumber ${pageNumber}`;
    }

    if (!isInteger(pageSize)) {
      throw `Invalid pageSize ${pageSize}`;
    }

    // Query the Lesson repository to retrieve lessons for the given course
    const lessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder("lessons")
      .where("lessons.courseId = :courseId", { courseId }) // filter by courseId
      .orderBy("lessons.seqNo") // sort by sequence number
      .skip(pageNumber * pageSize) // skip results for previous pages
      .take(pageSize) // limit number of results per page
      .getMany(); // execute query and return results

    // Return the paginated list of lessons as a JSON response
    response.status(200).json({ lessons });
  } catch (error) {
    // Log and forward any error to the Express error handler
    logger.error(`Error calling findLessonsForCourse()`);
    return next(error);
  }
}
