"use client";
import { useEffect, useState } from "react";

export default function Blogs() {
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
            <button className="border-none bg-green-400 hover:bg-green-500 w-full -mt-17 md:w-[180px] h-12 rounded-lg text-white transition-colors">
              Read Our Latest Posts
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-end items-end pt-23 ml-25 -mt-10">
            <img
              src="/images/mos.png"
              className="max-w-[800px] h-[500px] md:max-w-md lg:max-w-lg object-contain"
              alt="Mosque illustration"
            />
          </div>
        </div>

        {/* Wave SVG */}
        {/* <div className="absolute bottom-0 left-0 right-0 -mb-">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-20 md:h-32"
          >
            <path
              fill="#ffffff"
              d="M0,0 C360,100 1080,100 1440,0 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div> */}
      </div>
      <div className="flex flex-col bg-[#EFF5FD] pb-20">
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
              <button className="border-none bg-green-400 w-[140px] h-12 rounded-lg text-white hover:bg-green-500 transition-colors">
                Read More
              </button>
            </div>
          </div>
        ))} 
          <div className="flex ml-[1105px]">
            <button className="border-none bg-green-400 w-[140px] h-12 rounded-lg text-white hover:bg-green-500 transition-colors">
                Read More
              </button>
          </div>

      </div>

      <div>
        <p className="flex  text-3xl text-[#33A9E0] items-center justify-center mt-10">Reviews</p>
        <div className="flex gap-20 items-center justify-center">
          <div className="w-1/4 shadow-lg rounded-lg p-10 mb-5 mt-10 ">
            <p>Reading The Power of Daily Du'a reminded me to be more mindful in my prayers.
               It felt like it was written just for me. Jazakallah Khair for such uplifting content!
            </p>
            <div className="flex flex-col items-end justify-end">
              <p>
              A.Abdulla
            </p>
            <p className="text-bold">
              UCSC
            </p>
            </div>
          </div>
          <div className="w-1/4 shadow-lg rounded-lg p-10 mb-5 mt-10 ">
            <p>Reading The Power of Daily Du'a reminded me to be more mindful in my prayers.
               It felt like it was written just for me. Jazakallah Khair for such uplifting content!
            </p>
            <div className="flex flex-col items-end justify-end">
              <p>
              A.Abdulla
            </p>
            <p className="text-bold">
              UCSC
            </p>
            </div>
          </div>
          <div className="w-1/4 shadow-lg rounded-lg p-10 mb-5 mt-10 ">
            <p>Reading The Power of Daily Du'a reminded me to be more mindful in my prayers.
               It felt like it was written just for me. Jazakallah Khair for such uplifting content!
            </p>
            <div className="flex flex-col items-end justify-end">
              <p>
              A.Abdulla
            </p>
            <p className="text-bold">
              UCSC
            </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
