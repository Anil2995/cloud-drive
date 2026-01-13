import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authorize } from '../middleware/authorize';

const router = Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Get User Route
router.get('/me', authorize, getMe);

export default router;
