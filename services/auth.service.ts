import { SignInDto, AuthResponse } from '@/types';

type MockUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  isAdmin:boolean;
  isActive:boolean;
  isEmailVerified:boolean;
  isPhoneVerified:boolean;
  createdAt:Date;
  updatedAt:Date;
};

// Mock user data with readonly constraint
// auth.service.ts
const mockUsers: readonly MockUser[] = [
  {
    id: '1',
    email: 'shimhanmohamad@gmail.com',
    password: 'Test@1234',
    name: 'Test User',
    isAdmin: false,
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
] as const;

export class AuthService {
  static async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    // Validate input (though AJV should handle this before reaching service)
    if (!signInDto.email?.trim() || !signInDto.password?.trim()) {
      throw new Error('Email and password are required');
    }

    // Find user with case-insensitive email comparison
    const user = mockUsers.find(u => 
      u.email.toLowerCase() === signInDto.email.toLowerCase().trim()
    );

    if (!user) {
      throw new Error('User not found. Please check your email address');
    }

    if (user.password !== signInDto.password) {
      throw new Error('Incorrect password. Please try again');
    }

    // Return response without password
    return {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin:user.isAdmin,
        isActive:user.isActive,
        isEmailVerified:user.isEmailVerified,
        isPhoneVerified:user.isPhoneVerified,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
      }
    };
  }
}