import { UpdateUserDto } from '../dto/user.dto';
import { IUser } from '../../interfaces/user.interface';
import prisma from '../../config/prisma-client';
import { createCustomError, HttpCode } from '../../utils/apiError';
import { comparePasswords, hashPassword } from '../../utils/password';

export class UserService {
  /**
   * Get all users
   */
  public static async getAllUsers(): Promise<IUser[]> {
    return await prisma.user.findMany();
  }

  /**
   * Get user by ID
   */
  public static async getUserById(id: string): Promise<IUser | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  /**
   * Update user
   */
  public static async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    if (updateUserDto.role) {
      throw createCustomError(
        'Only admins can change roles!',
        HttpCode.FORBIDDEN,
      );
    }

    return await prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  /**
   * Delete user (soft delete)
   */
  public static async deleteUser(id: string): Promise<IUser> {
    return await prisma.user.update({
      where: { id },
      data: { active: false },
    });
  }

  /**
   * Get current user profile
   */
  public static async getMe(userId: string): Promise<IUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw createCustomError('User not found', HttpCode.NOT_FOUND);
    return user;
  }

  /**
   * Update current user password
   */
  public static async updateMyPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<IUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw createCustomError('User not found', HttpCode.NOT_FOUND);

    if (!(await comparePasswords(currentPassword, user.password))) {
      throw createCustomError('Current password is incorrect', 401);
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: await hashPassword(newPassword),
        passwordChangedAt: new Date(),
      },
    });
  }
}
