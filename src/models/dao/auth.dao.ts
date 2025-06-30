import { Role } from '@prisma/client';
import { LoginDto, CreateUserDto } from '../dto/user.dto';
import { IUser } from '../../interfaces/user.interface';
import prisma from '../../config/prisma-client';
import { createCustomError, HttpCode } from '../../utils/apiError';
import { comparePasswords, hashPassword } from '../../utils/password';
import { generateToken } from '../../utils/generateToken';

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

    const token = generateToken({ id: user.id, role: user.role });

    return { token, user };
  }
}
