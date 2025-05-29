import { NextResponse } from 'next/server';
import { blogService } from '@/services';

export class BlogController {
  private static instance: BlogController;

  private constructor() {}

  public static getInstance(): BlogController {
    if (!BlogController.instance) {
      BlogController.instance = new BlogController();
    }
    return BlogController.instance;
  }

  async getAllBlogs() {
    try {
      const blogs = await blogService.getAllBlogs();
      return NextResponse.json({ blogs }, { status: 200 });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blogs' },
        { status: 500 }
      );
    }
  }

  async getBlogById(id: string) {
    try {
      const blog = await blogService.getBlogById(id);
      if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
      console.error('Error fetching blog:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog' },
        { status: 500 }
      );
    }
  }

  async createBlog(request: Request) {
    try {
      const body = await request.json();
      
      if (!body.title || !body.content) {
        return NextResponse.json(
          { error: 'Title and content are required' },
          { status: 400 }
        );
      }

      const id = await blogService.createBlog(body);
      return NextResponse.json(
        { id, message: 'Blog created successfully' },
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

  async updateBlog(id: string, request: Request) {
    try {
      const body = await request.json();
      
      if (!body.title && !body.content) {
        return NextResponse.json(
          { error: 'At least one field (title or content) is required' },
          { status: 400 }
        );
      }

      await blogService.updateBlog(id, body);
      return NextResponse.json(
        { message: 'Blog updated successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating blog:', error);
      return NextResponse.json(
        { error: 'Failed to update blog' },
        { status: 500 }
      );
    }
  }

  async deleteBlog(id: string) {
    try {
      await blogService.deleteBlog(id);
      return NextResponse.json(
        { message: 'Blog deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting blog:', error);
      return NextResponse.json(
        { error: 'Failed to delete blog' },
        { status: 500 }
      );
    }
  }
}

export const blogController = BlogController.getInstance(); 