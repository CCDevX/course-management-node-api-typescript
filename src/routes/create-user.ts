import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { User } from "../models/user";
import { calculatePasswordHash } from "../utils";
const crypto = require("crypto");

/**
 *
 * curl -X POST http://localhost:9000/api/users -H "Content-Type:application/json" -d '{"email": "new-user@angular-university.io", "pictureUrl":"https://avatars.githubusercontent.com/u/5454709", "password": "test123", "isAdmin": false}'
 *
 */
export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called createUser()`);

    const { email, pictureUrl, password, isAdmin } = request.body;

    if (!email) {
      throw "Could not extract the email from the request, aborting.";
    }

    if (!password) {
      throw "Could not extract the plain text password from the request, aborting.";
    }

    const repository = AppDataSource.getRepository(User);

    // Check if a user with the same email already exists in the database
    const user = await repository
      .createQueryBuilder("users")
      .where("email = :email", { email })
      .getOne();

    // If user already exists, return an error
    if (user) {
      const message = `User with email ${email} already exists, aborting.`;
      logger.error(message);
      response.status(500).json({ message });
      return;
    }

    // Generate a random password salt (64 bytes) and convert it to a hex string
    const passwordSalt = crypto.randomBytes(64).toString("hex");

    // Derive a secure password hash using the plain text password and the salt
    const passwordHash = await calculatePasswordHash(password, passwordSalt);

    // Create a new user entity with the hashed password and salt
    const newUser = repository.create({
      email,
      pictureUrl,
      isAdmin,
      passwordHash,
      passwordSalt,
    });

    // Save the new user to the database
    await AppDataSource.manager.save(newUser);

    logger.info(`User ${email} has been created.`);

    // Respond with public user information (excluding password fields)
    response.status(200).json({
      email,
      pictureUrl,
      isAdmin,
    });
  } catch (error) {
    // Log and forward any errors to the error handling middleware
    logger.error(`Error calling createUser()`);
    return next(error);
  }
}
