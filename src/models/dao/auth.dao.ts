import { Role } from '@prisma/client';
import { LoginDto, CreateUserDto } from '../dto/user.dto';
import { IUser } from '../../interfaces/user.interface';
import prisma from '../../config/prisma-client';
import { createCustomError, HttpCode } from '../../utils/apiError';
import { comparePasswords, hashPassword } from '../../utils/password';
import { generateToken } from '../../utils/generateToken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../services/email.service';

export class AuthService {
  /**
   * Register a new user
   */
  public async signUp(createUserDto: CreateUserDto): Promise<IUser | null> {
    const hashedPassword = await hashPassword(createUserDto.password);

    const user = await prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        passwordConfirm: undefined,
        role: createUserDto.role || Role.USER,
      },
    });

    return user;
  }

  /**
   * Login user
   */
  public async login(loginDto: LoginDto): Promise<{ token: any; user: IUser }> {
    const user = await prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !(await comparePasswords(loginDto.password, user.password))) {
      throw createCustomError(
        'Incorrect email or password',
        HttpCode.UNAUTHORIZED,
      );
    }

    if (!user.active) {
      throw createCustomError(
        'User account is deactivated',
        HttpCode.UNAUTHENTICATED,
      );
    }

    const token = await generateToken({ id: user.id, role: user.role });

    return { token, user };
  }

  /**
   * Forgot password - generates reset token and sends email
   */
  public async forgotPassword(email: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createCustomError(
        'No user found with that email address',
        HttpCode.NOT_FOUND,
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: resetTokenExpires,
      },
    });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetURL);
    } catch (err) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      throw createCustomError(
        'There was an error sending the email. Try again later.',
        HttpCode.INTERNAL_SERVER_ERROR,
      );
    }

    return resetToken;
  }

  /**
   * Reset password using token
   */
  public async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ token: any; user: IUser }> {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw createCustomError(
        'Token is invalid or has expired',
        HttpCode.BAD_REQUEST,
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
      },
    });

    const token = await generateToken({
      id: updatedUser.id,
      role: updatedUser.role,
    });

    return { token, user: updatedUser };
  }
}
