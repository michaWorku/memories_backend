import * as express from 'express';
import {
  createMemory,
  getMemories,
  getMemory,
  updateMemory,
  deleteMemory,
} from '../controllers/memory.controller'

import protect from '../middleware/authMiddleware'

const router = express.Router();

router.use(protect)

// Memories routes
router
  .route('/')
    .get(getMemories)
    .post(createMemory)

router
  .route('/:id')
    .get(getMemory)
    .patch(updateMemory)
    .delete(deleteMemory)

export default router
