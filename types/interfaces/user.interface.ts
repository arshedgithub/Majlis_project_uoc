import { UserStatus, UserType } from '../enums';

export interface User {
    id?: string;
    name: string;
    email: string;
    password: string
    userType: UserType;
    status: UserStatus;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}