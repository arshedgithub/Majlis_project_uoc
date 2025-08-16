import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required'
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

    // Authenticate user
    const result = await userService.signIn(email, password);

    return NextResponse.json({
      success: true,
      message: 'Sign in successful',
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error: any) {
    console.error('Sign in error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Sign in failed'
      },
      { status: 400 }
    );
  }
} 