import { DataSource } from "typeorm";
import { Course } from "./models/course";
import { Lesson } from "./models/lesson";
import { User } from "./models/user";

// Create and export a new TypeORM data source instance
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydatabase",
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [Course, Lesson, User],
  synchronize: true,
  logging: true,
});
