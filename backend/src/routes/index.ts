import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { tasksRoutes } from '../modules/tasks/tasks.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

router.use('/auth', authRoutes);
router.use('/tasks', tasksRoutes);

export const apiRoutes = router;
