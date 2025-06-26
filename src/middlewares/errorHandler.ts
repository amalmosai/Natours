import { Request, Response, NextFunction } from 'express';
import { HttpCode, ApiError } from '../utils/apiError';
import { Prisma } from '@prisma/client';
import Joi from 'joi';
interface CustomError {
  statusCode: number;
  message: string;
  status: string;
  stack?: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let customError: CustomError = {
    statusCode: HttpCode.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong try again later',
    status: 'error',
  };

  /**
   * Handle custom API errors
   */
  if (err instanceof ApiError) {
    customError.message = err.message;
    customError.statusCode = err.statusCode;
    customError.status = err.status;
  }

  /**
   * Handle Prisma validation errors
   */
  if (err instanceof Prisma.PrismaClientValidationError) {
    customError.message = Object.values(err.message)
      .map((item: any) => item.message)
      .join(',');
    customError.statusCode = HttpCode.BAD_REQUEST;

    if (process.env.NODE_ENV === 'development') {
      customError.message = `Type validation failed: ${err.message.split('\n').slice(0, 2).join(' ')}`;
    }
  }

  /**
   * Handle known Prisma request errors
   */
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        const field = Array.isArray(err.meta?.target)
          ? err.meta.target[0]
          : 'field';
        customError.message = `${field} already exists`;
        customError.statusCode = HttpCode.CONFLICT;
        break;
      case 'P2003':
        customError.message = 'Invalid reference ID provided';
        customError.statusCode = HttpCode.BAD_REQUEST;
        break;
      case 'P2025':
        customError.message = String(err.meta?.cause) || 'Record not found';
        customError.statusCode = HttpCode.NOT_FOUND;
        break;
      case 'P2000':
        customError.message = 'Invalid data provided';
        customError.statusCode = HttpCode.BAD_REQUEST;
        break;
      default:
        customError.message = `Database error: ${err.message}`;
        customError.statusCode = HttpCode.BAD_REQUEST;
        break;
    }
  }

  /**
   * Handle Joi validation errors
   */
  if ((err as any).isJoi) {
    const joiError = err as Joi.ValidationError;
    customError.message = joiError.details
      .map((detail) => detail.message)
      .join(', ');
    customError.statusCode = HttpCode.BAD_REQUEST;
  }

  /**
   * Handle JWT errors
   */
  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    customError.message = 'Invalid token. Please log in again!';
    customError.statusCode = HttpCode.UNAUTHORIZED;
  }

  if (err instanceof Error && err.name === 'TokenExpiredError') {
    customError.message = 'Your token has expired! Please log in again.';
    customError.statusCode = HttpCode.UNAUTHORIZED;
  }

  /**
   * Handle 404 for API routes
   */
  if (req?.url.startsWith('/api/v1/') && !req.route) {
    customError.statusCode = HttpCode.NOT_FOUND;
    customError.message = 'Not Found';
  }

  /**
   * Development vs Production error response
   */
  const errorResponse: any = {
    status: customError.status,
    message: customError.message,
    statusCode: customError.statusCode,
  };

  /**
   * Include stack trace and error details in development mode
   */
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.error = err;
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  res.status(customError.statusCode).json(errorResponse);
};
