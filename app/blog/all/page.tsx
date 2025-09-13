"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AllBlogs() {
  const [select, setSelect] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Sample blog data - replace with your actual data fetching logic
  const blogs = [
    { id: 1, title: "Education Blog", category: "education" },
    { id: 2, title: "Women's Health", category: "women" },
    { id: 3, title: "Business Tips", category: "business" },
  ];

  // Filter blogs based on search and category selection
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = select ? blog.category === select : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-[350px] bg-[url('/images/allblog.png')] bg-cover bg-center">
        <h1 className="text-4xl font-bold mb-8 text-white">All Blogs</h1>
        <p className="text-lg text-white mb-4">Explore our collection of insightful blogs</p>
        <Link href="/blog">
          <Button className="bg-gradient-to-r from-[#2E2AB1] to-[#33A9E0] text-white hover:from-[#33A9E0] hover:to-[#2E2AB1] transition-colors">
            Back to Blogs
          </Button>
        </Link>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select
            id="category-select"
            value={select}
            onChange={(e) => setSelect(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full md:w-[300px]"
          > 
            <option value="">All Categories</option>
            <option value="education">Education</option>
            <option value="women">Women</option>
            <option value="health">Health</option>
            <option value="business">Business</option>
          </select>
          <input 
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-grow"
          />
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <div key={blog.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full mb-2">
                    {blog.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                  <Link href={`/blog/${blog.id}`}>
                    <Button variant="outline" className="mt-4">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No blogs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}