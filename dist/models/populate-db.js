"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const result = dotenv_1.default.config();
require("reflect-metadata");
const db_data_1 = require("./db-data");
const data_source_1 = require("../data-source");
const course_1 = require("./course");
const lesson_1 = require("./lesson");
const user_1 = require("./user");
const utils_1 = require("../utils");
async function populateDb() {
    await data_source_1.AppDataSource.initialize();
    console.log(`Database connection ready.`);
    const courses = Object.values(db_data_1.COURSES);
    const courseRepository = data_source_1.AppDataSource.getRepository(course_1.Course);
    const lessonsRepository = data_source_1.AppDataSource.getRepository(lesson_1.Lesson);
    for (let courseData of courses) {
        console.log(`Inserting course ${courseData.title}`);
        const course = courseRepository.create(courseData);
        await courseRepository.save(course);
        for (let lessonData of courseData.lessons) {
            console.log(`Inserting lesson ${lessonData.title}`);
            const lesson = lessonsRepository.create(lessonData);
            lesson.course = course;
            await lessonsRepository.save(lesson);
        }
    }
    const users = Object.values(db_data_1.USERS);
    for (let userData of users) {
        console.log(`Inserting user: ${userData}`);
        const { email, pictureUrl, isAdmin, passwordSalt, plainTextPassword } = userData;
        const user = data_source_1.AppDataSource.getRepository(user_1.User).create({
            email,
            pictureUrl,
            isAdmin,
            passwordSalt,
            passwordHash: await (0, utils_1.calculatePasswordHash)(plainTextPassword, passwordSalt),
        });
        await data_source_1.AppDataSource.manager.save(user);
    }
    const totalCourses = await courseRepository.createQueryBuilder().getCount();
    const totalLessons = await lessonsRepository.createQueryBuilder().getCount();
    console.log(` Data Inserted - courses ${totalCourses}, lessons ${totalLessons}`);
}
populateDb()
    .then(() => {
    console.log(`Finished populating database, exiting!`);
    process.exit(0);
})
    .catch((err) => {
    console.error(`Error populating database.`, err);
});
