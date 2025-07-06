"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Blog = {
  content: any;
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
};

export default function AllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([
  {
    "id": "1",
    "title": "Exploring the Mountains of Sri Lanka",
    "author": "Nimal Perera",
    "imageUrl": "data:image/jpeg;base64,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",
    "content": "Discover the breathtaking landscapes and hiking trails of Sri Lanka’s central highlands."
  },
  {
    "id": "2",
    "title": "Top 10 Beaches You Must Visit",
    "author": "Sanduni Silva",
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXo3xlrCq-EDrU-GDPowfLiKDeAUrGHSgCew&s",
    "content": "From Mirissa to Nilaveli, these beaches offer sun, surf, and serenity."
  },
  {
    "id": "3",
    "title": "A Cultural Tour Through Kandy",
    "author": "Kavindu Jayasuriya",
    "imageUrl": "/images/kandy.jpg",
    "content": "Explore the rich history, temples, and traditions of the sacred city of Kandy."
  },
  {
    "id": "4",
    "title": "Street Food Delights in Colombo",
    "author": "Dilani Fernando",
    "imageUrl": "/images/food.jpg",
    "content": "A journey through spicy, sweet, and savory street food gems in the capital."
  },
  {
    "id": "5",
    "title": "A Wildlife Safari in Yala National Park",
    "author": "Ruwan Gunasekara",
    "imageUrl": "/images/safari.jpg",
    "content": "Witness leopards, elephants, and exotic birds on a thrilling safari adventure."
  }
]
);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchBlogs() {
//       try {
//         const res = await fetch("/api/blogs");
//         const data = await res.json();
//         setBlogs(data);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBlogs();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-12 w-12 animate-spin" />
//       </div>
//     );
//   }

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-4xl font-bold mb-6 text-center">All Blogs</h1>
      <div className="flex flex-col border-separate">
        {blogs.map((blog) => (
  <Card key={blog.id} className="shadow hover:shadow-lg transition-all flex" style={{borderRadius:"0px"}}>
    <div className="w-4/5">
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-xl font-bold">{blog.title}</CardTitle>

        <p className="text-sm text-gray-700">
          {blog.content.split(" ").slice(0, 50).join(" ")}{blog.content.split(" ").length > 50 && '...'}
        </p>

        <p className="text-sm text-gray-600">By {blog.author}</p>

        <div className="flex gap-2 pt-2">
          <Link href={`/blogs/${blog.id}`}>
            <Button variant="outline" size="sm">View</Button>
          </Link>
          <Link href={`/blogs/edit?id=${blog.id}`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
        </div>
      </CardContent>
    </div>
    {blog.imageUrl && (
      <div className="w-1/5 p-4">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="h-full object-cover rounded-l"
        />
      </div>
    )}
  </Card>
))}

      </div>
    </div>
  );
}
