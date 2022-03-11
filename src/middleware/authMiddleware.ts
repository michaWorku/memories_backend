import { NextFunction, Request, Response } from 'express'
import config from 'config'
import jwt from 'jsonwebtoken'
import catchAsync from '../utils/catchAsync'
import User from '../models/user.model'
import ApiError from '../utils/apiError'

const protect = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    let token

    if( req.headers.authorization  &&
        req.headers.authorization.startsWith('Bearer')){

        token = req.headers.authorization.split(' ')[1] 

        if(!token){
          return next(new ApiError('Not authorized, no token', 401))
        }

        const decoded =  jwt.verify(token, config.get('JWT_SECRET'))
        if(!decoded){
          return next( new ApiError('Not authorized, Invalid token', 401))
        }
        
        // @ts-ignore
        req.user = await User.findById(decoded?.user?._id).select('-password -confirmPassword')

        next()
        
    }
   
})


export default protect
