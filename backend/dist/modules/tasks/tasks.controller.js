"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
const tasks_service_1 = require("./tasks.service");
exports.tasksController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const query = (req.validated?.query ?? req.query);
        const data = await tasks_service_1.tasksService.list(req.user.id, query);
        (0, response_1.sendSuccess)(res, 200, 'Tasks fetched successfully', data);
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const body = req.validated?.body ?? req.body;
        const data = await tasks_service_1.tasksService.create(req.user.id, body);
        (0, response_1.sendSuccess)(res, 201, 'Task created successfully', data);
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const params = (req.validated?.params ?? req.params);
        const data = await tasks_service_1.tasksService.getById(req.user.id, params.id);
        (0, response_1.sendSuccess)(res, 200, 'Task fetched successfully', data);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const params = (req.validated?.params ?? req.params);
        const body = req.validated?.body ?? req.body;
        const data = await tasks_service_1.tasksService.update(req.user.id, params.id, body);
        (0, response_1.sendSuccess)(res, 200, 'Task updated successfully', data);
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const params = (req.validated?.params ?? req.params);
        await tasks_service_1.tasksService.remove(req.user.id, params.id);
        (0, response_1.sendSuccess)(res, 200, 'Task deleted successfully');
    }),
    toggle: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const params = (req.validated?.params ?? req.params);
        const data = await tasks_service_1.tasksService.toggle(req.user.id, params.id);
        (0, response_1.sendSuccess)(res, 200, 'Task status toggled successfully', data);
    }),
};
