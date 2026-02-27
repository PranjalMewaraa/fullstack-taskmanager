import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { emptyBodySchema, loginSchema, registerSchema } from './auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(emptyBodySchema), authController.refresh);
router.post('/logout', validate(emptyBodySchema), authController.logout);

export const authRoutes = router;
