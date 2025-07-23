import { addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { db } from '@/config';
import { collection, getDocs } from 'firebase/firestore';

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
// export  async function POST(request: Request) {
//   try {
//     // 1. Verify Content-Type
//     const contentType = request.headers.get('content-type');
//     if (!contentType?.includes('application/json')) {
//       return NextResponse.json(
//         { message: 'Invalid content type, expected application/json' },
//         { status: 400 }
//       );
//     }

//     // 2. Parse request body
//     const signInDto = await request.json();
    
//     // 3. Validate required fields
//     if (!signInDto.email || !signInDto.password) {
//       return NextResponse.json(
//         { message: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     // 4. Authenticate user
//     const authResponse = await AuthService.signIn(signInDto);

//     // 5. Return successful response
//     return NextResponse.json(
//       {
//         message: "Login successful",
//         token: authResponse.token,
//         user: {
//           email: authResponse.user.email,
//           name: authResponse.user.name
//         }
//       },
//       { status: 200 }
//     );
    
//   } catch (error: any) {
//     // 6. Handle errors consistently
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { 
//         message: error.message || 'Authentication failed',
//         success: false
//       },
//       { 
//         status: 401,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       }
//     );
//   }
// }


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usersRef = collection(db, 'users');
    
    // Add validation here
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const docRef = await addDoc(usersRef, {
      ...body,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(
      { id: docRef.id, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}