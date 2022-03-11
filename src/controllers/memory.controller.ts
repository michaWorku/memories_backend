import { NextFunction, Request, Response } from 'express'
import { memoryUsage } from 'process'
import Category from '../models/category.model'
import Memory, { MemoryDoc } from '../models/memory.model'
import User from '../models/user.model'
import ApiError from '../utils/apiError'
import catchAsync from '../utils/catchAsync'

export const sendMemory = (res: Response, statusCode: number, memory: MemoryDoc) =>
  res.status(statusCode).json({ status: 'success', memory })

//@desc create new memory
//@route POST /api/memories
//@access private 
export const createMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const memory = await Memory.create({...req.body, user: req.user._id})

    if (!memory) {
      return next(new ApiError('Bad request', 400))
    }

    // @ts-ignore
    await User.findByIdAndUpdate(req.user._id, { $push: { memories: memory._id} })

    sendMemory(res, 201, memory)
  }
)

//@desc Add memory to a category
//@route POST /api/memories/:memoryId/:categoryId
//@access private 
export const addMemoryToCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findOne({ _id: req.params.categoryId }).populate(
      'memories'
    )
    const memory = await Memory.findOne({ _id: req.params.memoryId })

    if (!category || !memory) {
      return next(new ApiError('Category or memory not found', 404))
    }

    if (category && memory) {
      await Category.findByIdAndUpdate(category._id, {
        $addToSet: { memories: memory },
      })
    }

    sendMemory(res, 200, memory)
  }
)

//@desc Remove memory to a category
//@route DELETE /api/memories/:memoryId/:categoryId
//@access private 
export const removeMemoryFromCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findOne({ _id: req.params.memoryId })
    const category = await Category.findOne({ _id: req.params.categoryId })

    if (!category || !memory) {
      return next(new ApiError('Category or memory not found', 404))
    }

    await Category.findByIdAndUpdate(category?._id, {
      $pull: { memories: memory?._id },
    })

    res.status(204).json({
      status: 'success',
    })
  }
)

//@desc Get all memories
//@route GET /api/memories/
//@access private 
export const getMemories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let category = req.query.category || 'all'
    // @ts-ignore
    const page = +req.query.page || 1
    // @ts-ignore
    const limit = +req.query.limit || 3
    // @ts-ignore
    const skip = (page - 1) * limit

    let memories, userCategory
    let idxOfFirstInCategory,
      idxOfLastInCategory = 0

    if (req.query.category && req.query.category !== 'all') {
      userCategory = await Category.findOne({
        // @ts-ignore
        user: req.user._id,
        // @ts-ignore
        name: category,
      }).populate('memories')
      idxOfFirstInCategory = skip
      idxOfLastInCategory = skip + limit
      memories = userCategory?.memories.splice(
        idxOfFirstInCategory,
        idxOfLastInCategory
      )
    } else {
      // Show all memories handler
      if (limit === 10) {
        memories = await Memory
          // @ts-ignore
          .find({ user: req.user })
          .skip(skip)
      } else {
        // Show particular number of memories
        memories = await Memory
          // @ts-ignore
          .find({ user: req.user })
          .skip(skip)
          .limit(limit)
      }
    }

    if (!memories) {
      return next(new ApiError('Memories not found', 404))
    }

    res.status(200).json({
      status: 'success',
      memories,
    })
  }
)

//@desc Get a memory
//@route GET /api/memories/:id
//@access private 
export const getMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findOne({ _id: req.params.id })

    if (!memory) {
      return next(new ApiError('Bad request', 400))
    }

    sendMemory(res, 200, memory)
  }
)

//@desc Update a memory
//@route PATCH /api/memories/:id
//@access private 
export const updateMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!memory) {
      return next(new ApiError('Bad request', 400))
    }

    sendMemory(res, 200, memory)
  }
)

//@desc update a memory
//@route PATCH /api/memories/:id
//@access private 
export const deleteMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!(await Memory.findByIdAndRemove(req.params.id))) {
      return next(new ApiError('Memory not found', 404))
    }

    // Delete memory if it was in user's favorites
    await User.findByIdAndUpdate(
      // @ts-ignore
      req.user,
      { $pull: { favorites: req.params.id , memories: req.params.id} }
    )

    res.status(204).json({
      status: 'success',
    })
  }
)


