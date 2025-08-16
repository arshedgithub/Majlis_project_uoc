# Majlis Project - Firebase Integration

A Next.js application with Firebase Firestore database integration, designed for serverless deployment on Vercel.

## Features

- 🔥 **Firebase Authentication** - Secure user authentication with Firebase Auth
- 📊 **Firestore Database** - NoSQL database for scalable data storage
- 🚀 **Serverless Architecture** - Optimized for Vercel deployment
- 🔐 **Role-based Authorization** - User types: Super Admin, Admin, Lecturer, Student, Alumni
- 📝 **Blog Management** - Create, read, update, delete blogs with publishing workflow
- 👥 **User Management** - Complete user lifecycle management
- ✅ **Input Validation** - Robust request validation
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel
- **Validation**: AJV (JSON Schema validation)

## Prerequisites

- Node.js 18+ 
- Firebase project
- Vercel account (for deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Majlis_project_uoc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database

2. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Add a web app if not already added
   - Copy the Firebase config object

3. **Get Firebase Admin SDK Credentials**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# JWT Secret (for legacy compatibility)
JWT_SECRET=your_jwt_secret_key
```

### 5. Firestore Security Rules

Set up Firestore security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.firebaseUid || 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType in ['SUPER_ADMIN', 'ADMIN']);
      allow write: if request.auth != null && request.auth.uid == resource.data.firebaseUid;
      allow create: if request.auth != null;
    }
    
    // Blogs collection
    match /blogs/{blogId} {
      allow read: if resource.data.isPublished == true || 
                   (request.auth != null && request.auth.uid == resource.data.authorId) ||
                   (request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType in ['SUPER_ADMIN', 'ADMIN']);
      allow write: if request.auth != null && 
                    (request.auth.uid == resource.data.authorId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType in ['SUPER_ADMIN', 'ADMIN']);
      allow create: if request.auth != null;
    }
  }
}
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration

### Blogs

- `GET /api/blogs` - Get all blogs (with optional filters)
- `POST /api/blogs` - Create a new blog (Admin only)
- `GET /api/blogs/[id]` - Get blog by ID
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## Database Schema

### Users Collection

```typescript
interface User {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  userType: 'SUPER_ADMIN' | 'ADMIN' | 'LECTURER' | 'STUDENT' | 'ALUMINI';
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Blogs Collection

```typescript
interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Deployment to Vercel

### 1. Connect to Vercel

```bash
npm install -g vercel
vercel login
```

### 2. Configure Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Add all environment variables from `.env.local`
3. Make sure to properly format the `FIREBASE_PRIVATE_KEY` with newlines

### 3. Deploy

```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

```
Majlis_project_uoc/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Main application pages
│   └── admin/             # Admin dashboard
├── components/            # Reusable UI components
├── config/               # Configuration files
├── lib/                  # Utility functions
├── middlewares/          # Authentication & validation middlewares
├── services/             # Business logic services
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Key Services

### FirebaseService
- Singleton service for Firebase operations
- Handles Firestore CRUD operations
- Manages Firebase Authentication
- Supports batch operations and transactions

### UserService
- User authentication and management
- Firebase Auth integration
- User lifecycle operations

### BlogService
- Blog CRUD operations
- Publishing workflow
- Tag management
- Search functionality

## Security Features

- Firebase Authentication with JWT tokens
- Role-based access control
- Input validation with JSON Schema
- Firestore security rules
- Server-side token verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
