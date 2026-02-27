"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
const env_1 = require("../config/env");
const notFoundHandler = (_req, _res, next) => {
    next(new apiError_1.ApiError(404, 'Route not found'));
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: err.issues.map((issue) => issue.message).join(', '),
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: env_1.env.NODE_ENV === 'production' ? 'Internal server error' : 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
