"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const tasks_routes_1 = require("../modules/tasks/tasks.routes");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});
router.use('/auth', auth_routes_1.authRoutes);
router.use('/tasks', tasks_routes_1.tasksRoutes);
exports.apiRoutes = router;
