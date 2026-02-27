"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = require("./routes");
exports.app = (0, express_1.default)();
const allowedOrigins = new Set([
    env_1.env.FRONTEND_ORIGIN,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]);
const corsMiddleware = (0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow non-browser requests and local/dev frontend origins.
        if (!origin || allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
            callback(null, true);
            return;
        }
        // Do not throw CORS errors during preflight; simply omit CORS for disallowed origins.
        callback(null, false);
    },
    credentials: true,
    optionsSuccessStatus: 204,
});
exports.app.use(corsMiddleware);
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use('/api/v1', routes_1.apiRoutes);
exports.app.use(error_middleware_1.notFoundHandler);
exports.app.use(error_middleware_1.errorHandler);
