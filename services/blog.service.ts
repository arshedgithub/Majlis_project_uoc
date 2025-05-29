import { firebaseService } from './firebase.service';
import { Blog } from '@/types';

export class BlogService {
  private static instance: BlogService;
  private readonly collectionName = 'blogs';

  private constructor() {}

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async getAllBlogs(): Promise<Blog[]> {
    return firebaseService.getAll<Blog>(this.collectionName);
  }

  async getBlogById(id: string): Promise<Blog | null> {
    return firebaseService.getById<Blog>(this.collectionName, id);
  }

  async createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return firebaseService.add<Blog>(this.collectionName, blog);
  }

  async updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
    await firebaseService.update(this.collectionName, id, blog);
  }

  async deleteBlog(id: string): Promise<void> {
    await firebaseService.delete(this.collectionName, id);
  }
}

export const blogService = BlogService.getInstance(); 