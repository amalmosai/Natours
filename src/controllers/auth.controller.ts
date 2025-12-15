import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../models/dao/auth.dao';
import {
  loginSchema,
  createUserSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from '../validations/user.validation';
import { asyncWrapper } from '../utils/asynHandler';
import { createCustomError, HttpCode } from '../utils/apiError';
import { LoginDto, CreateUserDto } from '../models/dto/user.dto';

export class AuthController {
  /**
   *
   * @param authService
   * Dependency injection
   */
  public constructor(private readonly authService: AuthService) {}

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

    res.status(HttpCode.CREATED).json({
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

      res.status(HttpCode.OK).json({
        status: 'success',
        token,
        data: { user },
        message: 'User login successfully',
      });
    },
  );

  /**
   * Handles forgot password - sends reset token to email
   */
  public forgotPassword = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      if (!email) {
        throw createCustomError(
          'Please provide an email address',
          HttpCode.BAD_REQUEST,
        );
      }

      const resetToken = await this.authService.forgotPassword(email);

      res.status(HttpCode.OK).json({
        status: 'success',
        message: 'Password reset token sent to email',
        resetToken:
          process.env.NODE_ENV === 'development' ? resetToken : undefined,
      });
    },
  );

  /**
   * Handles password reset with token
   */
  public resetPassword = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { resetToken } = req.params;
      const { password } = req.body;
      const { error } = resetPasswordSchema.validate(req.body);

      if (error) {
        throw createCustomError(error.details[0].message, HttpCode.BAD_REQUEST);
      }

      const { token, user } = await this.authService.resetPassword(
        resetToken,
        password,
      );

      res.status(HttpCode.OK).json({
        status: 'success',
        token,
        data: { user },
        message: 'Password reset successfully',
      });
    },
  );

  /**
   * * Handles password update for logged-in users
   */
  public updatePassword = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      const { error } = changePasswordSchema.validate(req.body);

      if (error) {
        throw createCustomError(error.details[0].message, HttpCode.BAD_REQUEST);
      }

      const { token, user } = await this.authService.updatePassword(
        userId,
        currentPassword,
        newPassword,
      );
      res.status(HttpCode.OK).json({
        status: 'success',
        token,
        data: { user },
        message: 'Password updated successfully',
      });
    },
  );
}
