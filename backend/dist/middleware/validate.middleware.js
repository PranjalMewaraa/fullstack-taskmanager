"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const apiError_1 = require("../utils/apiError");
const validate = (schema) => (req, _res, next) => {
    const parsed = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });
    if (!parsed.success) {
        const details = parsed.error.issues.map((issue) => issue.message).join(', ');
        return next(new apiError_1.ApiError(400, details || 'Validation error'));
    }
    const data = parsed.data;
    req.validated = data;
    req.body = data.body;
    next();
};
exports.validate = validate;
