"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = isInteger;
exports.calculatePasswordHash = calculatePasswordHash;
const crypto = require("crypto");
const util = require("util");
const hashPassword = util.promisify(crypto.pbkdf2);
function isInteger(input) {
    return input?.match(/^\d+$/) ?? false;
}
async function calculatePasswordHash(plainTextPassword, passwordSalt) {
    const passwordHash = await hashPassword(plainTextPassword, passwordSalt, 1000, 64, "sha512");
    return passwordHash.toString("hex");
}
