// services/auth.service.ts
import { SignInDto, AuthResponse } from '@/types';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'shimhanmohamad@gmail.com',
    password: '12345678', // In real app, store hashed passwords
    name: 'Test User'
  }
];

export class AuthService {
  static async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user = mockUsers.find(u => u.email === signInDto.email);
    
    if (!user || user.password !== signInDto.password) {
      throw new Error('Invalid credentials');
    }

    // In a real app, generate a proper JWT token
    const token = 'mock-jwt-token';
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
}