import { NextRequest, NextResponse } from 'next/server';
import { authenticate, validateRequest, validateQueryParams, isAnyAdmin } from '@/middlewares';
import { createBlogSchema, blogQuerySchema } from '@/types';
import { blogService } from '@/services';

export async function GET(request: NextRequest) {
  try {
    const validationResult = await validateQueryParams(blogQuerySchema)(request);
    if (validationResult instanceof NextResponse && validationResult.status !== 200) return validationResult;

    const blogs = await blogService.getAllBlogs();
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse && authResult.status !== 200) return authResult;

    const validationResult = await validateRequest(createBlogSchema)(request);
    if (validationResult instanceof NextResponse && validationResult.status !== 200) return validationResult;

    const authzResult = await isAnyAdmin(request);
    if (authzResult instanceof NextResponse && authzResult.status !== 200) return authzResult;

    const blogData = await request.json();
    const blogId = await blogService.createBlog(blogData);
    
    return NextResponse.json(
      { message: 'Blog created successfully', id: blogId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 