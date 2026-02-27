"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const apiError_1 = require("../utils/apiError");
const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new apiError_1.ApiError(401, 'Unauthorized'));
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.ACCESS_TOKEN_SECRET);
        req.user = { id: decoded.sub, email: decoded.email };
        next();
    }
    catch {
        next(new apiError_1.ApiError(401, 'Unauthorized'));
    }
};
exports.authenticate = authenticate;
