import { firebaseService } from './firebase.service';
import { Blog } from '@/types/interfaces/blog.interface';
import { PaginationOptions, QueryOptions } from './firebase.service';

export interface CreateBlogData {
  title: string;
  content: string;
  authorId: string;
  // authorName: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
}

export interface BlogQueryOptions {
  authorId?: string;
  isPublished?: boolean;
  tags?: string[];
  search?: string;
  pagination?: PaginationOptions;
}

export class BlogService {
  private static instance: BlogService;
  private readonly collectionName = 'blogs';

  private constructor() { }

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async getAllBlogs(options?: BlogQueryOptions): Promise<Blog[]> {
    try {
      // const queryOptions: QueryOptions[] = [];

      // if (options?.authorId) {
      //   queryOptions.push({ field: 'authorId', operator: '==', value: options.authorId });
      // }

      // if (options?.isPublished !== undefined) {
      //   queryOptions.push({ field: 'isPublished', operator: '==', value: options.isPublished });
      // }

      // if (queryOptions.length > 0) {
      //   return await firebaseService.queryWithOptions<Blog>(
      //     this.collectionName, 
      //     queryOptions, 
      //     options?.pagination
      //   );
      // }

      return await firebaseService.getAll<Blog>(this.collectionName, options?.pagination);
    } catch (error: any) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }
  }

  async getBlogById(id: string): Promise<Blog | null> {
    try {
      return await firebaseService.getById<Blog>(this.collectionName, id);
    } catch (error: any) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  }

  async getPublishedBlogs(options?: { limit?: number; orderBy?: string }): Promise<Blog[]> {
    try {
      return await firebaseService.queryWithOptions<Blog>(this.collectionName, [
        { field: 'isPublished', operator: '==', value: true }
      ], {
        limit: options?.limit,
        orderBy: options?.orderBy || 'publishedAt',
        orderDirection: 'desc'
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch published blogs: ${error.message}`);
    }
  }

  async getBlogsByAuthor(authorId: string, options?: { limit?: number; orderBy?: string }): Promise<Blog[]> {
    try {
      return await firebaseService.queryWithOptions<Blog>(this.collectionName, [
        { field: 'authorId', operator: '==', value: authorId }
      ], {
        limit: options?.limit,
        orderBy: options?.orderBy || 'createdAt',
        orderDirection: 'desc'
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch blogs by author: ${error.message}`);
    }
  }

  async getBlogsByTags(tags: string[], options?: { limit?: number; orderBy?: string }): Promise<Blog[]> {
    try {
      const queryOptions: QueryOptions[] = [];

      for (const tag of tags) {
        queryOptions.push({ field: 'tags', operator: 'array-contains', value: tag });
      }

      return await firebaseService.queryWithOptions<Blog>(this.collectionName, queryOptions, {
        limit: options?.limit,
        orderBy: options?.orderBy || 'createdAt',
        orderDirection: 'desc'
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch blogs by tags: ${error.message}`);
    }
  }

  async createBlog(blogData: CreateBlogData): Promise<string> {
    try {
      const blogDoc = {
        ...blogData,
        isPublished: blogData.isPublished ?? false,
        publishedAt: blogData.isPublished ? (blogData.publishedAt || new Date().toISOString()) : null,
        tags: blogData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await firebaseService.add<Blog>(this.collectionName, blogDoc);
    } catch (error: any) {
      throw new Error(`Failed to create blog: ${error.message}`);
    }
  }

  async updateBlog(id: string, blogData: UpdateBlogData): Promise<void> {
    try {
      const updateData: any = {
        ...blogData,
        updatedAt: new Date().toISOString()
      };

      // If publishing for the first time, set publishedAt
      if (blogData.isPublished && !blogData.publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }

      await firebaseService.update(this.collectionName, id, updateData);
    } catch (error: any) {
      throw new Error(`Failed to update blog: ${error.message}`);
    }
  }

  async deleteBlog(id: string): Promise<void> {
    try {
      await firebaseService.delete(this.collectionName, id);
    } catch (error: any) {
      throw new Error(`Failed to delete blog: ${error.message}`);
    }
  }

  async publishBlog(id: string): Promise<void> {
    try {
      await this.updateBlog(id, {
        isPublished: true,
        publishedAt: new Date().toISOString()
      });
    } catch (error: any) {
      throw new Error(`Failed to publish blog: ${error.message}`);
    }
  }

  async unpublishBlog(id: string): Promise<void> {
    try {
      await this.updateBlog(id, {
        isPublished: false,
        publishedAt: undefined
      });
    } catch (error: any) {
      throw new Error(`Failed to unpublish blog: ${error.message}`);
    }
  }

  async addTagsToBlog(id: string, tags: string[]): Promise<void> {
    try {
      const blog = await this.getBlogById(id);
      if (!blog) {
        throw new Error('Blog not found');
      }

      const existingTags = blog.tags || [];
      const newTags = [...new Set([...existingTags, ...tags])];

      await this.updateBlog(id, { tags: newTags });
    } catch (error: any) {
      throw new Error(`Failed to add tags to blog: ${error.message}`);
    }
  }

  async removeTagsFromBlog(id: string, tags: string[]): Promise<void> {
    try {
      const blog = await this.getBlogById(id);
      if (!blog) {
        throw new Error('Blog not found');
      }

      const existingTags = blog.tags || [];
      const newTags = existingTags.filter(tag => !tags.includes(tag));

      await this.updateBlog(id, { tags: newTags });
    } catch (error: any) {
      throw new Error(`Failed to remove tags from blog: ${error.message}`);
    }
  }

  async getBlogStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    authors: number;
  }> {
    try {
      const allBlogs = await this.getAllBlogs();
      const publishedBlogs = allBlogs.filter(blog => blog.isPublished);
      const draftBlogs = allBlogs.filter(blog => !blog.isPublished);
      const uniqueAuthors = new Set(allBlogs.map(blog => blog.authorId));

      return {
        total: allBlogs.length,
        published: publishedBlogs.length,
        draft: draftBlogs.length,
        authors: uniqueAuthors.size
      };
    } catch (error: any) {
      throw new Error(`Failed to get blog stats: ${error.message}`);
    }
  }

  async searchBlogs(searchTerm: string, options?: { limit?: number }): Promise<Blog[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation - for production, consider using Algolia or similar
      const allBlogs = await this.getAllBlogs({ pagination: { limit: options?.limit || 50 } });

      const searchLower = searchTerm.toLowerCase();
      return allBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    } catch (error: any) {
      throw new Error(`Failed to search blogs: ${error.message}`);
    }
  }
}

export const blogService = BlogService.getInstance(); 