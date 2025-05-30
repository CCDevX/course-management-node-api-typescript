import { Response, Request, NextFunction } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";

// Express route handler to fetch all courses from the database
export async function getAllCourses(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called getAllCourses()`);

    // Fetch all courses using TypeORM's QueryBuilder
    // - Get the repository for the Course entity
    // - Create a query builder aliasing the table as "courses"
    // - Order the results by the 'seqNo' field
    // - Execute the query and return all matching records
    const courses = await AppDataSource.getRepository(Course)
      .createQueryBuilder("courses")
      .orderBy("courses.seqNo")
      .getMany();

    // Send the list of courses back to the client with a 200 OK status
    response.status(200).json({ courses });
  } catch (error) {
    // Log the error message
    logger.error(`Error calling getAllCourses()`);
    return next(error);
  }
}
