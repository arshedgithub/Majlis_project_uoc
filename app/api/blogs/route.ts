import { blogController } from '@/controllers';

export async function GET() {
  return blogController.getAllBlogs();
}

export async function POST(request: Request) {
  return blogController.createBlog(request);
} 