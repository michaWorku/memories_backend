import { NextFunction, Request, Response } from 'express'
import { nextTick } from 'process'
import Category, { CategoryDoc } from '../models/category.model'
import User from '../models/user.model'
import ApiError from '../utils/apiError'
import catchAsync from '../utils/catchAsync'

const sendCategory = (
  res: Response,
  statusCode: number,
  category: CategoryDoc
) => res.status(statusCode).json({ status: 'success', category })

//@desc Create category for memory
//@route POST /api/categories
//@access private
export const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
    const category = await Category.create({
      name: req.body.name,
      // @ts-ignore
      user: req.user
    })

    // @ts-ignore
    if (!req.user || !category) {
      return next(new ApiError('User or category not found', 404))
    }

    // @ts-ignore
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { categories: category },
    })

    sendCategory(res, 201, category)
  }
)

//@desc Get all memory categories for a user
//@route Get /api/categories
//@access private
export const getCategories = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = await User.findOne({_id: req.user._id}).populate({
      path: 'categories',
      populate: [
        {
          path: 'memories',
          model: 'Memory',
        },
      ],
    })
    
    if(!user){
        next(new ApiError('user not found',404))
    }

    res.status(200).json({
      status: 'success',
      categories: user?.categories
    })
})

//@desc Edit a category
//@route PATCH /api/categories/:id
//@access private
export const editCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!category) {
      return next(new ApiError('Category not found', 404))
    }

    sendCategory(res, 200, category)
  }
)

//@desc Delete a category
//@route PATCH /api/categories/:id
//@access private
export const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!(await Category.findByIdAndRemove(req.params.id))) {
      return next(new ApiError('Category not found', 404))
    }

    // @ts-ignore
    await User.findByIdAndUpdate(req.user, {
      $pull: { categories: req.params.id },
    })

    res.status(204).json({
      status: 'success',
    })
  }
)
