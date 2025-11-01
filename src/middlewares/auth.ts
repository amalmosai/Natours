import { Request, Response, NextFunction } from 'express';
import Jwt, { Secret } from 'jsonwebtoken';
import { createCustomError, HttpCode } from '../utils/apiError';
import { UserService } from '../models/dao/user.dao';
import { asyncWrapper } from '../utils/asynHandler';
import { JwtPayload } from '../interfaces/jwt.interface';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        createCustomError(`No token provided`, HttpCode.UNAUTHORIZED),
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(
        createCustomError(
          `Authorization token not found"`,
          HttpCode.UNAUTHORIZED,
        ),
      );
    }

    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET as Secret,
    ) as JwtPayload;

    req.user = decoded;
    const currentUser = await UserService.getUserById(req.user.id);

    if (!currentUser) {
      return next(
        createCustomError(
          'The user belonging to this token does no longer exist.',
          HttpCode.UNAUTHORIZED,
        ),
      );
    }

    if (UserService.changedPasswordAfter(currentUser, decoded.iat)) {
      return next(
        createCustomError(
          'User recently changed password! Please log in again.',
          HttpCode.UNAUTHORIZED,
        ),
      );
    }

    req.user = currentUser;
    next();
  },
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createCustomError(
          `Unauthorized to access this route`,
          HttpCode.UNAUTHORIZED,
        ),
      );
    }
    next();
  };
};
