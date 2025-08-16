import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { userService } from '@/services/user.service';
import { User } from '@/types/interfaces/user.interface';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminAuth = getAuth();

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
  firebaseUser?: any;
}

export const authenticateFirebase = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user from Firestore
    const user = await userService.getUserByFirebaseUid(decodedToken.uid);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'User account is deactivated' },
        { status: 403 }
      );
    }

    // Attach user to request
    (request as AuthenticatedRequest).user = user;
    (request as AuthenticatedRequest).firebaseUser = decodedToken;

    return NextResponse.next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return NextResponse.json(
        { error: 'Token revoked' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
};

export const optionalAuth = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.next();
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (decodedToken) {
      const user = await userService.getUserByFirebaseUid(decodedToken.uid);
      if (user && user.isActive) {
        (request as AuthenticatedRequest).user = user;
        (request as AuthenticatedRequest).firebaseUser = decodedToken;
      }
    }

    return NextResponse.next();
  } catch (error) {
    // For optional auth, we don't fail the request
    return NextResponse.next();
  }
}; 