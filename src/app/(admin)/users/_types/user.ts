export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  mustChangePassword: boolean;
  lastLogin: string;
  userRol: UserRolType;
};

export enum UserRolType {
  ADMIN = "ADMIN",
  RECEPCIONIST = "RECEPCIONIST",
}

export type UserProfileOutput = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

export type UserLoginInput = {
  email: string;
  password: string;
};

export type UserLoginOutput = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userRol: UserRolType;
};

export type UserLogin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userRol: UserRolType;
};
