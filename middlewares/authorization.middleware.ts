import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthenticatedRequest } from './auth.middleware';
import { UserType } from '@/types';

export const validatePermission = (allowedTypes: UserType[]) => {
  return async (request: NextRequest) => {
    const authenticatedRequest = request as AuthenticatedRequest;
    
    if (!authenticatedRequest.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!authenticatedRequest.user.userType) {
      return NextResponse.json(
        { error: 'User type not defined' },
        { status: 403 }
      );
    }

    if (allowedTypes.includes(authenticatedRequest.user.userType as UserType)) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { 
        error: 'Access denied',
        message: `Required user types: ${allowedTypes.join(', ')}`
      },
      { status: 403 }
    );
  };
};

export const isSuperAdmin = validatePermission([UserType.SUPER_ADMIN]);
export const isAdmin = validatePermission([UserType.ADMIN]);
export const isAnyAdmin = validatePermission([UserType.ADMIN, UserType.SUPER_ADMIN]);
export const isStudent = validatePermission([UserType.STUDENT]);
export const isLecturer = validatePermission([UserType.LECTURER]);
export const isAlumini = validatePermission([UserType.ALUMINI]);
export const isRegisteredUser = validatePermission([UserType.SUPER_ADMIN, UserType.ADMIN, UserType.LECTURER, UserType.LECTURER, UserType.STUDENT]); 