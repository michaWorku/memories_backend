import { Express, Request, Response } from 'express'
import * as express from 'express';
import {
  createMemory,
  getMemories,
  getMemory,
  updateMemory,
  deleteMemory,
  addMemoryToCategory,
  removeMemoryFromCategory,
} from './controllers/memory.controller'

import requiresUser from './middleware/requiresUser'

import app from '../app'

const router = express.Router();

app.use(requiresUser)

// Memories routes
router.route('/').get(getMemories).post(createMemory)

router.route('/:id').get(getMemory).post(addMemoryToCategory).patch(updateMemory).delete(deleteMemory)

router.delete('/api/memories/:memoryId/:categoryId', removeMemoryFromCategory)

export default router


