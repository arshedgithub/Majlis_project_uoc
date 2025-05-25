import { NextResponse } from 'next/server';
import { db } from '@/config';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export async function GET() {
  try {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const blogsRef = collection(db, 'blogs');
    
    // Add validation here
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const docRef = await addDoc(blogsRef, {
      ...body,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(
      { id: docRef.id, message: 'Blog created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
} 