import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { User, UserStatus, UserType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, userType } = await request.json();

    // Basic validation
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, password, and user type are required'
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 6 characters long'
        },
        { status: 400 }
      );
    }

    if (!Object.values(UserType).includes(userType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid user type'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists'
        },
        { status: 409 }
      );
    }

    const newUser: User = {
      name,
      email,
      password,
      userType: UserType.STUDENT,
      status: UserStatus.PENDING,
      isEmailVerified: false,
      isPhoneVerified: false
    }
    const result = await userService.signUp(newUser, password);
    
    return NextResponse.json({
      success: true,
      message: 'Sign up successful',
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error: any) {
    console.error('Sign up error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Sign up failed'
      },
      { status: 400 }
    );
  }
} 