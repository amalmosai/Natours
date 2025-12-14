import { Request, Response, NextFunction } from 'express';
import { UserService } from '../models/dao/user.dao';
import { asyncWrapper } from '../utils/asynHandler';
import { createCustomError, HttpCode } from '../utils/apiError';
import { updateUserSchema } from '../validations/user.validation'

export class UserController{
   /**
   *
   * @param userService
   * Dependency injection
   */
  public constructor(private readonly userService: UserService){}

  public updateMe = asyncWrapper(async (req: Request, res: Response) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      throw createCustomError(error.details[0].message, HttpCode.BAD_REQUEST);
    }


    res.status(HttpCode.OK).json({
    status: 'success',
    // data: {
    //   user: updatedUser
    // },
    message: 'Profile updated successfully'
  });
  })

  public deleteMe = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req.user.id;
    await this.userService.deleteUser(userId);


    res.status(HttpCode.OK).json({
        status: 'success',
        data: null,
        message: 'Your account has been deleted successfully',
      });
  })

}