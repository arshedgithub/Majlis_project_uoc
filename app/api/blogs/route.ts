import { NextRequest, NextResponse } from 'next/server';
// import { authenticateFirebase, isAnyAdmin } from '@/middlewares';
import { blogService } from '@/services';
// import { AuthenticatedRequest } from '@/middlewares/firebase-auth.middleware';
import { Blog } from '@/types';
import blogs from '@/db/blogs.json'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    const isPublished = searchParams.get('isPublished');
    const limit = searchParams.get('limit');
    const orderBy = searchParams.get('orderBy');

    const options = {
      authorId: authorId || undefined,
      isPublished: isPublished ? isPublished === 'true' : undefined,
      pagination: {
        limit: limit ? parseInt(limit) : undefined,
        orderBy: orderBy || 'createdAt',
        orderDirection: 'desc' as const
      }
    };

    const blogs = await blogService.getAllBlogs(options);

    return NextResponse.json({
      success: true,
      data: blogs
    });
  } catch (error: any) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch blogs' 
      },
      { status: 500 }
    );
  }


}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    // const authResult = await authenticateFirebase(request);
    // if (authResult instanceof NextResponse) return authResult;

    // Check authorization
    // const authzResult = await isAnyAdmin(request);
    // if (authzResult instanceof NextResponse) return authzResult;

    const { title, content, category, authorId, imageUrl, isPublished } = await request.json();

    // Basic validation
    if (!title || !content || !category || !authorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and content are required'
        },
        { status: 400 }
      );
    }

    // const authenticatedRequest = request as AuthenticatedRequest;
    // const user = authenticatedRequest.user!;

    const blogData = {
      id: "4",
      title,
      content,
      category,
      authorId,
      tags: [],
      imageUrl: imageUrl ?? '',
      isPublished: isPublished ?? false
    };

    const blogId = await blogService.createBlog(blogData);
    blogs.push(blogData);


    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: { id: blogData.id }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to create blog' 
      },
      { status: 500 }
    );
  }
} 