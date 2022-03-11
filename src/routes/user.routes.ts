import * as express from 'express';
import { signup, signin, getUser } from '../controllers/user.controller'
import protect from '../middleware/authMiddleware'
const router = express.Router();

// Auth routes
router.post('/signin', signin);
router.post('/signup', signup);

// User routes
router.get('/users/:id',protect, getUser)


export default router;