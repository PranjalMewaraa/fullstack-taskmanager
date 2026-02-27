import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { tasksController } from './tasks.controller';
import {
  createTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
  listTasksSchema,
  toggleTaskSchema,
  updateTaskSchema,
} from './tasks.schema';

const router = Router();

router.use(authenticate);

router.get('/', validate(listTasksSchema), tasksController.list);
router.post('/', validate(createTaskSchema), tasksController.create);
router.get('/:id', validate(getTaskSchema), tasksController.getById);
router.patch('/:id', validate(updateTaskSchema), tasksController.update);
router.delete('/:id', validate(deleteTaskSchema), tasksController.remove);
router.patch('/:id/toggle', validate(toggleTaskSchema), tasksController.toggle);

export const tasksRoutes = router;
