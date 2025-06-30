import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../models/dao/auth.dao';
import { UserService } from '../models/dao/user.dao';
import { loginSchema, createUserSchema } from '../validations/user.validation';
import { asyncWrapper } from '../utils/asynHandler';
import { createCustomError, HttpCode } from '../utils/apiError';
import { LoginDto, CreateUserDto } from '../models/dto/user.dto';

export class AuthController {
  /**
   *
   * @param authService
   * Dependency injection
   */
  public constructor(
    private readonly authService: AuthService,
    // private readonly userService: UserService,
  ) {}

  /**
   * Handles user registration
   */
  public signup = asyncWrapper(async (req: Request, res: Response) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      throw createCustomError(error.details[0].message, HttpCode.BAD_REQUEST);
    }

    const signupDto = new CreateUserDto(req.body);
    const user = await this.authService.signUp(signupDto);

    res.status(201).json({
      status: 'success',
      data: { user },
      message: 'User register successfully',
    });
  });

  /**
   * Handles user login
   */
  public login = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        throw createCustomError(error.details[0].message, HttpCode.BAD_REQUEST);
      }

      const loginDto = new LoginDto(req.body);
      const { token, user } = await this.authService.login(loginDto);

      res.status(200).json({
        status: 'success',
        token,
        data: { user },
        message: 'User login successfully',
      });
    },
  );
}
