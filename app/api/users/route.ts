import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { SignInDto } from '@/types';
import { db } from '@/config';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export async function GET() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const signInDto = await request.json();
    const authResponse = await AuthService.signIn(signInDto);
    return NextResponse.json(authResponse, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}


// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const usersRef = collection(db, 'users');
    
//     // Add validation here
//     if (!body.email || !body.name) {
//       return NextResponse.json(
//         { error: 'Email and name are required' },
//         { status: 400 }
//       );
//     }

//     const docRef = await addDoc(usersRef, {
//       ...body,
//       createdAt: new Date().toISOString()
//     });

//     return NextResponse.json(
//       { id: docRef.id, message: 'User created successfully' },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return NextResponse.json(
//       { error: 'Failed to create user' },
//       { status: 500 }
//     );
//   }
// } 