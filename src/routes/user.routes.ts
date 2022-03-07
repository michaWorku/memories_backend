import * as express from 'express';
import { signup, signin, getUser } from '../controllers/user.controller'
import requiresUser from '../middleware/requiresUser'
const router = express.Router();

// Auth routes
router.post('/signin', signin);
router.post('/signup', signup);

// User routes
router.get('/users/:id',requiresUser, getUser)


export default router;