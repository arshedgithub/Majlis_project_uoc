import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { appConfig } from '@/config';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    userType: string;
    status: string;
  };
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: appConfig.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const user = {
        id: jwtPayload.id,
        email: jwtPayload.email,
        userType: jwtPayload.userType || 'user',
        status: jwtPayload.status || 'active'
      };

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false, { message: 'Error validating user' });
    }
  })
);

export const authenticate = async (request: NextRequest) => {
  return new Promise((resolve) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
      if (err) {
        resolve(NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        ));
        return;
      }

      if (!user) {
        resolve(NextResponse.json(
          { error: 'Invalid or expired token', message: info?.message },
          { status: 401 }
        ));
        return;
      }

      if (!user.userType) {
        resolve(NextResponse.json(
          { error: 'User type not defined in token' },
          { status: 403 }
        ));
        return;
      }

      (request as AuthenticatedRequest).user = user;
      resolve(NextResponse.next());
    })(request);
  });
};
