"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Blogs() {
  const router = useRouter();
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Unity in Islam",
      content:
        "Unity (wahdah) lies at the heart of Islamic teachings. This reflection explores practical ways to strengthen unity in our communities today, emphasizing collaboration, mutual respect, and shared purpose.",
      image: "/images/pegion.png",
    },
    {
      id: 2,
      title: "The Power of Patience in Daily Life",
      content:
        "Patience (sabr) is a virtue highly regarded in Islam. This article discusses how cultivating patience can transform our personal lives and relationships, drawing from Quranic teachings and prophetic examples.",
      image: "/images/quran.png",
    },
    {
      id: 3,
      title: "Charity Beyond Ramadan",
      content:
        "While charity peaks during Ramadan, Islam encourages consistent giving year-round. Explore practical ways to maintain your charitable spirit beyond the holy month and its lasting impact on communities.",
      image: "/images/dua.png",
    },
    {
      id: 4,
      title: "Balancing Technology and Spirituality",
      content:
        "In our digital age, maintaining spiritual connection can be challenging. This post offers guidance on using technology mindfully while preserving our Islamic values and daily worship practices.",
      image: "/images/education.png",
    },
  ];

  const handleLatestBlogClick = () => {
    const latestBlogSection = document.getElementById("latest-insights");
    if (latestBlogSection) {
      latestBlogSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReadMoreClick = (postId: number) => {
    router.push(`/blogs/${postId}`);
  };

  const handleSeeAllClick = () => {
    router.push("/blogs/all");
  };
  
  return (
    <>
      <div className="relative flex flex-col w-full h-[475px] bg-gray-100 bg-gradient-to-r from-[#2E2AB1] to-[#33A9E0] overflow-hidden">
        <div className="flex flex-col md:flex-row container mx-auto px-4 py-12 md:py-24 z-10 gap-20">
          <div className="w-full md:w-1/2 px-4 -mt-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-tight">
              Voices of the Ummah:Insights,
              <br /> Reflections & Unity
            </h1>
            <p className="text-base md:text-sm text-white max-w-lg mb-8">
              Welcome to the Muslim Majlis Blog — your space for thoughtful
              reflections, community updates, and discussions that matter.
              Whether it's faith, culture, or current events, we aim to uplift
              and inspire through knowledge and connection.
            </p>
            <Button 
              className="bg-white text-[#2E2AB1] hover:bg-blue-400 hover:text-white"
              onClick={handleLatestBlogClick}
            >
              Read Our Latest Blog
            </Button>
          </div>
          <div className="w-full md:w-1/2 flex justify-end items-end pt-23 ml-25 -mt-10">
            <img
              src="/images/mos.png"
              className="max-w-[800px] h-[500px] md:max-w-md lg:max-w-lg object-contain"
              alt="Mosque illustration"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col bg-[#EFF5FD] pb-20" id="latest-insights">
        <h1 className="flex text-4xl items-center justify-center text-[#33A9E0] py-12">
          Latest Insights
        </h1>

        {blogPosts.map((post, index) => (
          <div
            key={post.id}
            className={`flex items-center justify-center gap-12 my-8 px-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="flex-shrink-0">
              <img
                src={post.image}
                className="w-[300px] h-[250px] object-cover rounded-lg"
                alt="Blog post illustration"
              />
            </div>
            <div className={`max-w-xl ${index % 2 === 0 ? "ml-12" : "mr-12"}`}>
              <p className="text-2xl font-semibold text-[#33A9E0] mb-4">
                {post.title}
              </p>
              <p className="text-gray-700 mb-6">{post.content}</p>
              <Button 
                className="bg-gradient-to-r from-[#2E2AB1] to-[#33A9E0]"
                onClick={() => handleReadMoreClick(post.id)}
              >
                Read More
              </Button>
            </div>
          </div>
        ))} 
        
        <div className="flex ml-[1105px]">
          <Button 
            className="bg-gradient-to-r from-[#2E2AB1] to-[#33A9E0]"
            onClick={handleSeeAllClick}
          >
            See All
          </Button>
        </div>
      </div>

      <div>
        <p className="flex text-3xl text-[#33A9E0] items-center justify-center mt-10">Reviews</p>
        <div className="flex gap-20 items-center justify-center">
          {[0, 1, 2].map((reviewIndex) => (
            <div 
              key={reviewIndex}
              className="w-1/4 shadow-lg rounded-lg p-10 mb-5 mt-10 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleReviewClick(reviewIndex)}
            >
              <p>Reading The Power of Daily Du'a reminded me to be more mindful in my prayers.
                It felt like it was written just for me. Jazakallah Khair for such uplifting content!
              </p>
              <div className="flex flex-col items-end justify-end">
                <p>A.Abdulla</p>
                <p className="text-bold">UCSC</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}