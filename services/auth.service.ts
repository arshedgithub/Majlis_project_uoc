import { SignInDto, AuthResponse,SignUpDto } from '@/types';
import bcryptjs from 'bcryptjs';

type MockUser = {
  id: string;
  email: string;
  password: string;
  confirmPassword?: string; // Optional for sign-in
  gender?: string; // Optional for sign-in
  contactNumber?: string; 
  faculty:string;// Optional for sign-in
  degree:string;// Optional for sign-in
  name: string;
  userType?: string; // Optional for sign-in
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
    updatedAt: new Date(),
    faculty: '',
    degree: ''
  }
] as const;

export class AuthService {
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!hasLowerCase) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!hasNumbers) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!hasSpecialChar) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password is valid' };
}
  static findUserByEmail(email: string): MockUser | undefined {
    // Find user with case-insensitive email comparison
    return mockUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase().trim()
    );
}
  static async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    // Validate input
    if (!signInDto.email?.trim() || !signInDto.password?.trim()) {
      throw new Error('Email and password are required');
    }

    // Find user by email
    const user = this.findUserByEmail(signInDto.email);

    if (!user) {
      throw new Error('User not found. Please check your email address');
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcryptjs.compare(signInDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Incorrect password. Please try again');
    }

    // Return response without password
    return {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      cookies: {}, // Add a mock or actual cookies object as required
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  static async register(signUpDto:SignUpDto): Promise<MockUser> {
    // Validate input
    if (!signUpDto.email?.trim() || !signUpDto.password?.trim() || !signUpDto.name?.trim() || !signUpDto.faculty?.trim() || !signUpDto.degree?.trim() || !signUpDto.contactNumber?.trim() || !signUpDto.confirmPassword?.trim() || !signUpDto.gender?.trim()){
      throw new Error('All input fields are required');
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => 
      u.email.toLowerCase() === signUpDto.email.toLowerCase().trim()
    );

    if (existingUser) {
      throw new Error('User already exists with this email address');
    }

    // Create new user
    const newUser: MockUser = {
      id: (mockUsers.length + 1).toString(),
      ...signUpDto,
      isAdmin: false,
      isActive: true,
      isEmailVerified: false,
      isPhoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulate adding to database
    (mockUsers as MockUser[]).push(newUser);

    return newUser;
  }
}