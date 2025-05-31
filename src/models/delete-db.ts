import * as dotenv from "dotenv";

const result = dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Lesson } from "./lesson";
import { Course } from "./course";
import { User } from "./user";
import { IsNull, Not } from "typeorm";

async function deleteDb() {
  await AppDataSource.initialize();

  console.log(`Database connection ready.`);

  console.log(`Clearing LESSONS table.`);

  await AppDataSource.getRepository(Lesson).delete({ id: Not(IsNull()) });

  console.log(`Clearing COURSES table.`);

  await AppDataSource.getRepository(Course).delete({ id: Not(IsNull()) });

  console.log(`Clearing USERS table.`);

  await AppDataSource.getRepository(User).delete({ id: Not(IsNull()) });
}

deleteDb()
  .then(() => {
    console.log(`Finished deleting database, exiting!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(`Error deleting database.`, err);
  });
