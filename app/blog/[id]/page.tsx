"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { blogData } from "@/lib/data/blog-data"; // Import the shared data
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Find the blog post from the imported data
  const localBlog = blogData.find((blog) => blog.id === postId);
  const currentIndex = blogData.findIndex((blog) => blog.id === postId);
  const prevBlog = currentIndex > 0 ? blogData[currentIndex - 1] : null;
  const nextBlog = currentIndex < blogData.length ? blogData[currentIndex + 1] : null;

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 mb-6">
      <div className="w-full">
        <Button
          className="justify-start ml-6 mr-6 mt-4 bg-black hover:bg-gray-700"
          onClick={() => router.replace('/blog/all')}>
          <ArrowLeft />Back
        </Button>
      </div>
      <div>
        <Card className="w-full max-w-4xl shadow-xl">
          <CardHeader className="flex gap-2">
            <CardTitle className="text-3xl">{post.title}</CardTitle>
            <div className="">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-black rounded-full">
                {post.category}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={200}
                height={200}
                className="w-full max-h-80 object-cover rounded-md"
              />
            )}
            <p className="text-sm text-gray-600">by {post.author}</p>
            <div className="prose max-w-none">{post.content}</div>
          </CardContent>
          <div className="ml-6 mr-6 mt-2 mb-4 flex justify-between">
            <Button
              onClick={() => prevBlog && router.push(`/blog/${prevBlog.id}`)}
              disabled={!prevBlog}
            ><ArrowLeft /> Previous</Button>
            <Button
              onClick={() => nextBlog && router.push(`/blog/${nextBlog.id}`)}
              disabled={!nextBlog}
              className=""
            >Next <ArrowRight /></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
