"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
// Create and export a custom logger instance
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston_1.default.format.json({
        space: 4,
    }),
    transports: [
        new winston_1.default.transports.File({
            filename: "logs/all.log",
        }),
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});
// In non-production environments, also log to the console
if (process.env.NODE_ENV !== "production") {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
