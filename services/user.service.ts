import { firebaseService } from './firebase.service';
import { User } from '@/types/interfaces/user.interface';
import { UserType } from '@/types/enums/userType.enum';
import { UserStatus } from '@/types';

export interface CreateUserData {
  name: string;
  email: string;
  userType: UserType;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export interface UpdateUserData {
  name?: string;
  userType?: UserType;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export class UserService {
  private static instance: UserService;
  private readonly collectionName = 'users';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Authentication methods
  async signIn(email: string, password: string) {
    try {
      const userCredential = await firebaseService.signIn(email, password);
      const user = await this.getUserByFirebaseUid(userCredential.user.uid);
      
      if (!user) {
        throw new Error('User not found in database');
      }

      if (user.status != UserStatus.APPROVED) {
        throw new Error('Unauthorized user');
      }

      return {
        user,
        token: await userCredential.user.getIdToken()
      };
    } catch (error: any) {
      throw new Error(`Sign in failed: ${error.message}`);
    }
  }

  async signUp(userData: CreateUserData, password: string) {
    try {
      // Create Firebase Auth user
      const userCredential = await firebaseService.signUp(userData.email, password, userData.name);
      
      // Create user document in Firestore
      const userDoc = {
        firebaseUid: userCredential.user.uid,
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
        isActive: userData.isActive ?? true,
        isEmailVerified: userData.isEmailVerified ?? false,
        isPhoneVerified: userData.isPhoneVerified ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const userId = await firebaseService.add<User>(this.collectionName, userDoc);
      
      return {
        user: { ...userDoc, id: userId },
        token: await userCredential.user.getIdToken()
      };
    } catch (error: any) {
      throw new Error(`Sign up failed: ${error.message}`);
    }
  }

  async signOut() {
    try {
      await firebaseService.signOut();
    } catch (error: any) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }

  async resetPassword(email: string) {
    try {
      await firebaseService.resetPassword(email);
    } catch (error: any) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  // User management methods
  async getAllUsers(options?: { limit?: number; orderBy?: string }): Promise<User[]> {
    try {
      return await firebaseService.getAll<User>(this.collectionName, {
        limit: options?.limit,
        orderBy: options?.orderBy || 'createdAt',
        orderDirection: 'desc'
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await firebaseService.getById<User>(this.collectionName, id);
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    try {
      const users = await firebaseService.queryWithOptions<User>(this.collectionName, [
        { field: 'firebaseUid', operator: '==', value: firebaseUid }
      ]);
      return users.length > 0 ? users[0] : null;
    } catch (error: any) {
      throw new Error(`Failed to fetch user by Firebase UID: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await firebaseService.queryWithOptions<User>(this.collectionName, [
        { field: 'email', operator: '==', value: email }
      ]);
      return users.length > 0 ? users[0] : null;
    } catch (error: any) {
      throw new Error(`Failed to fetch user by email: ${error.message}`);
    }
  }

  async createUser(userData: CreateUserData): Promise<string> {
    try {
      const userDoc = {
        ...userData,
        isActive: userData.isActive ?? true,
        isEmailVerified: userData.isEmailVerified ?? false,
        isPhoneVerified: userData.isPhoneVerified ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await firebaseService.add<User>(this.collectionName, userDoc);
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<void> {
    try {
      await firebaseService.update(this.collectionName, id, {
        ...userData,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await firebaseService.delete(this.collectionName, id);
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async activateUser(id: string): Promise<void> {
    try {
      await this.updateUser(id, { isActive: true });
    } catch (error: any) {
      throw new Error(`Failed to activate user: ${error.message}`);
    }
  }

  async deactivateUser(id: string): Promise<void> {
    try {
      await this.updateUser(id, { isActive: false });
    } catch (error: any) {
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  async getUsersByType(userType: UserType): Promise<User[]> {
    try {
      return await firebaseService.queryWithOptions<User>(this.collectionName, [
        { field: 'userType', operator: '==', value: userType }
      ]);
    } catch (error: any) {
      throw new Error(`Failed to fetch users by type: ${error.message}`);
    }
  }

  async getActiveUsers(): Promise<User[]> {
    try {
      return await firebaseService.queryWithOptions<User>(this.collectionName, [
        { field: 'isActive', operator: '==', value: true }
      ]);
    } catch (error: any) {
      throw new Error(`Failed to fetch active users: ${error.message}`);
    }
  }

  // Get current authenticated user
  getCurrentUser() {
    return firebaseService.getCurrentUser();
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: any) => void) {
    return firebaseService.onAuthStateChange(callback);
  }
}

export const userService = UserService.getInstance(); 