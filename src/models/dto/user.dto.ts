import { ILogin, IUser } from '../../interfaces/user.interface';
import { Role } from '@prisma/client';

export class CreateUserDto implements IUser {
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

  constructor(bodyRequest: IUser) {
    this.name = bodyRequest.name;
    this.email = bodyRequest.email;
    this.role = bodyRequest.role;
    this.password = bodyRequest.password;
    this.passwordConfirm = bodyRequest.passwordConfirm ?? undefined;
    this.passwordChangedAt = bodyRequest.passwordChangedAt;
    this.passwordResetToken = bodyRequest.passwordResetToken;
    this.passwordResetExpires = bodyRequest.passwordResetExpires;
    this.active = bodyRequest.active ?? true;
  }
}

export class UpdateUserDto implements Partial<IUser> {
  name?: string;
  email?: string;
  photo?: string | null;
  role?: Role;
  password?: string;
  passwordConfirm?: string | null;
  passwordChangedAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  active?: boolean;

  constructor(bodyRequest: Partial<IUser>) {
    Object.assign(this, bodyRequest);
  }
}

export class LoginDto {
  email: string;
  password: string;

  constructor(bodyRequest: ILogin) {
    this.email = bodyRequest.email;
    this.password = bodyRequest.password;
  }
}
