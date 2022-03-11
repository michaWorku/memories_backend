const express = require('express')
import {addMemoryToFavorites, getFavoriteMemories, removeMemoryFromFavorites} from '../controllers/favorite.controller'
import protect from '../middleware/authMiddleware'

const router = express.Router()

router.use(protect)

// Favorites routes
router.get('', getFavoriteMemories)

router
    .route('/:memoryId')
        .post( addMemoryToFavorites)
        .delete( removeMemoryFromFavorites)

export default router