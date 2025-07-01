import { Request, Response, NextFunction } from 'express';
import Jwt, { Secret } from 'jsonwebtoken';
import { createCustomError, HttpCode } from '../utils/apiError';
import { promisify } from 'util';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createCustomError(`No token provided`, HttpCode.UNAUTHORIZED));
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

  try {
    const decoded = await promisify<string, Secret>(Jwt.verify)(
      token,
      process.env.JWT_SECRET as Secret,
    );
    req.body.authUser = decoded;
    next();
  } catch (error) {
    return next(
      createCustomError(
        `Not authorized to access this route`,
        HttpCode.UNAUTHORIZED,
      ),
    );
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.body.authUser.role)) {
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
