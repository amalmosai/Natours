export class ApiError extends Error {
  readonly statusCode: number;
  readonly status: string;
  readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const createCustomError = (
  message: string,
  statusCode: number,
): ApiError => {
  return new ApiError(message, statusCode);
};

export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  UNAUTHENTICATED = 403,
  NOT_FOUND = 404,
  CREATED = 201,
  INTERNAL_SERVER_ERROR = 500,
  FORBIDDEN = 403,
  CONFLICT = 409,
}
