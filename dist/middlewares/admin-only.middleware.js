"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfAdmin = checkIfAdmin;
const logger_1 = require("../logger");
function checkIfAdmin(request, response, next) {
    const user = request["user"];
    if (!user?.isAdmin) {
        logger_1.logger.error(`The user is not an admin, access denied`);
        response.sendStatus(403);
        return;
    }
    logger_1.logger.debug(`The user is a valid admin, granting access.`);
    next();
}
