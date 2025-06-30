import { Role } from '@prisma/client';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  photo?: string | null;
  role?: Role;
  password: string;
  passwordConfirm: string | null | undefined;
  passwordChangedAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  active?: boolean;
}

export interface ILogin {
  email: string;
  password: string;
}
