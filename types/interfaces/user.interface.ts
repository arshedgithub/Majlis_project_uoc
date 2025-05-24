export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isActive: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}