import * as express from 'express';
import { signup, signin, getUser, getMe } from '../controllers/user.controller'
import protect from '../middleware/authMiddleware'
const router = express.Router();

// Auth routes
router.post('/signin', signin);
router.post('/signup', signup);

// User routes
router.use(protect)

router.get('/me', getMe)
router.get('/:id', getUser)



export default router;