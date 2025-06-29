import { Role } from '@prisma/client';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  photo?: string;
  role?: Role;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILogin {
  email: string;
  password: string;
}
