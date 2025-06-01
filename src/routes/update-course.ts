import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { isInteger } from "../utils";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";

/*
 *
 * curl -X PATCH http://localhost:9000/api/courses/76 -H "Content-Type:application/json" -d '{"title":"Typescript Bootcamp v2"}'
 *
 **/

export async function updateCourse(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called updateCourse()`);

    const courseId = request.params.courseId,
      changes = request.body;

    if (!isInteger(courseId)) {
      throw `Invalid course id ${courseId}`;
    }

    // Use TypeORM's query builder to update the course with the specified changes
    await AppDataSource.createQueryBuilder()
      .update(Course) // Target the Course entity
      .set(changes) // Apply the changes provided in the request body
      .where("id = :courseId", { courseId }) // Apply the update only to the course with this ID
      .execute(); // Execute the SQL UPDATE query

    // Return a success message to the client
    response.status(200).json({
      message: `Course ${courseId} was updated successfully.`,
    });
  } catch (error) {
    // Log and forward any error to the Express error handler
    logger.error(`Error calling updateCourse()`);
    return next(error);
  }
}
