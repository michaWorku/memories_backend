import * as express from 'express';
import { createCategory, deleteCategory, editCategory, getCategories } from '../controllers/category.controller';
import { addMemoryToCategory, removeMemoryFromCategory } from '../controllers/memory.controller';

import protect from '../middleware/authMiddleware'

const router = express.Router();

router.use(protect)

router
    .route('/')
        .get(getCategories)
        .post(createCategory)

router
    .route('/:id')
        .patch( editCategory)
        .delete(deleteCategory)

router
  .route('/:categoryId/:memoryId')
    .post(addMemoryToCategory)
    .delete(removeMemoryFromCategory)
export default router