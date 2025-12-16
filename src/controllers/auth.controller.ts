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
import { CookieOptions } from 'express';
import { generateToken } from '../utils/generateToken';
import { IUser } from '../interfaces/user.interface';

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
    if (!user) {
      throw createCustomError(
        'User registration failed',
        HttpCode.INTERNAL_SERVER_ERROR,
      );
    }

    const token = await this.sendCookieToken(user, res);

    res.status(HttpCode.CREATED).json({
      status: 'success',
      token,
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
      const { user } = await this.authService.login(loginDto);
      const token = await this.sendCookieToken(user, res);

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

      const { user } = await this.authService.resetPassword(
        resetToken,
        password,
      );

      const token = await this.sendCookieToken(user, res);

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

      const { user } = await this.authService.updatePassword(
        userId,
        currentPassword,
        newPassword,
      );

      const token = await this.sendCookieToken(user, res);

      res.status(HttpCode.OK).json({
        status: 'success',
        token,
        data: { user },
        message: 'Password updated successfully',
      });
    },
  );

  /**
   * Sends a cookie token to the client
   * @param user
   * @param res
   * @returns
   */
  private async sendCookieToken(user: IUser, res: Response): Promise<any> {
    const token = await generateToken({ id: user.id, role: user.role });

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    const expiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7');
    cookieOptions.maxAge = expiresInDays * 24 * 60 * 60 * 1000;

    res.cookie('authToken', token, cookieOptions);
    return token;
  }
}
