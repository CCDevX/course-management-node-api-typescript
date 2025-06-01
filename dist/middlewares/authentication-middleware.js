"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfAuthenticated = checkIfAuthenticated;
const logger_1 = require("../logger");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
function checkIfAuthenticated(request, response, next) {
    const authJwtToken = request.headers.authorization;
    if (!authJwtToken) {
        logger_1.logger.info(`The authentication JWT is not present, access denied.`);
        response.sendStatus(403);
        return;
    }
    checkJwtValidity(authJwtToken)
        .then((user) => {
        logger_1.logger.info(`Authentication JWT successfully decoded:`, user);
        request["user"] = user;
        next();
    })
        .catch((err) => {
        logger_1.logger.error(`Could not validate the authentication JWT, access denied.`, err);
        response.sendStatus(403);
    });
}
async function checkJwtValidity(authJwtToken) {
    const user = await jwt.verify(authJwtToken, JWT_SECRET);
    logger_1.logger.info("Found user details in JWT:", user);
    return user;
}
