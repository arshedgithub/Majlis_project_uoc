"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { blogData } from "@/lib/data/blog-data"; // Import the shared data

type Post = {
  id: string;
  title: string;
  author: string;
  content: string;
  imageUrl?: string;
  category?: string;
};

export default function ViewBlog() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Find the blog post from the imported data
  const localBlog = blogData.find(blog => blog.id === postId);

  useEffect(() => {
    async function loadPost() {
      try {
        // First try to fetch from API
        const res = await fetch(`/api/blogs/${postId}`);
        if (res.ok) {
          setPost(await res.json());
        } else {
          // Fallback to local data if API fails
          setPost(localBlog || null);
        }
      } catch (e) {
        console.error(e);
        // Fallback to local data on error
        setPost(localBlog || null);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId, localBlog]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <p className="text-center mt-10">Post not found.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">by {post.author}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-80 object-cover rounded-md"
            />
          )}
          <div className="prose max-w-none">{post.content}</div>
        </CardContent>
      </Card>
    </div>
  );
}