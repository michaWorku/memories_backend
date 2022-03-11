import { NextFunction, Request, Response } from 'express'
import Memory from '../models/memory.model'
import User from '../models/user.model'
import ApiError from '../utils/apiError'
import catchAsync from "../utils/catchAsync"
import { sendMemory } from './memory.controller'

//@desc Get fevorite memories
//@route GET /api/favorites/
//@access private 
export const getFavoriteMemories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = await User.findOne({ _id: req.user._id }).populate('favorites')

    if (!user) {
      return next(new ApiError('User not found', 404))
    }

    res.status(200).json({
      status: 'success',
      favorites: user?.favorites,
    })
  }
)

//@desc Add memories to favorites
//@route POST /api/favorites/:memoryId
//@access private 
export const addMemoryToFavorites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findOne({ _id: req.params.memoryId })

    if (!memory) {
      return next(new ApiError('Memory not found', 404))
    }

    await User.findByIdAndUpdate(
      // @ts-ignore
      req.user._id,
      { $push: { favorites: memory._id } }
    )

    sendMemory(res, 200, memory)
  }
)

//@desc Remove memories to favorites
//@route Delete /api/favorites/:memoryId
//@access private 
export const removeMemoryFromFavorites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const memory = await Memory.findOne({ _id: req.params.memoryId })

    if (!memory) {
      return next(new ApiError('Memory not found', 404))
    }

    // @ts-ignore
    console.log({user: req.user})

    await User.findByIdAndUpdate(
      // @ts-ignore
      req.user._id,
      { $pull: { favorites: memory._id } }
    )

    res.status(204).json({
      status: 'success',
    })
  }
)