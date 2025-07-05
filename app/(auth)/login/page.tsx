"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3200/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successfully");
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (error) {
      alert("An error occurred while logging in. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex items-center justify-center mb-8 relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-white bg-opacity-70 rounded-2xl">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-gray-700 text-lg font-medium">Loading...</p>
              <p className="text-gray-500 text-sm">Please wait a moment</p>
            </div>
          </div>
        )}

        {/* Image container */}
        <div className="relative bg-[url(/images/login.png)] bg-cover bg-center w-[430px] h-[500px] rounded-l-2xl border border-gray-150 shadow-xl flex flex-col items-center justify-center">
          {/* Home Button (top-left) */}
          <button className="absolute top-4 left-4 flex items-center justify-center gap-2 text-black w-[100px] h-[42px] bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </button>

          {/* Centered Content */}
          <div className="text-center">
            <p className="text-white text-4xl font-medium"> 
              Together in Faith, Stronger in Unity
            </p>
          </div>
        </div>

        {/* Form container */}
        <div className="flex flex-col items-center w-[500px] max-w-md">
          <Card className="w-full max-w-md shadow-xl h-[500px] rounded-r-2xl rounded-l-none">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-center text-blue-800cd ">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-6"
              >
                <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                  <label
                    htmlFor="username"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-1 outline-none text-sm"
                  />
                </div>
                <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                  <label
                    htmlFor="password"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-1 outline-none text-sm"
                  />
                </div>
                <p className="flex text-xs text-red-400 items-end justify-end">
                  <Link
                    href="/reset"
                    className="text-red-400 hover:underline font-bold -mt-4"
                  >
                    Forgot password
                  </Link>
                </p>
                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex items-center justify-center space-x-2 ">
              <p className="text-sm text-gray-500 font-bold">
                Don&apos;t have account?{" "}
                <Link
                  href="/register"
                  className="text-red-400 hover:underline font-bold"
                >
                  Register here
                </Link>
              </p>
            </CardFooter>
            <div className="flex items-center justify-center my-6 -mt-1">
              <hr className="w-[140px] border-t border-gray-200" />
              <span className="px-4 text-sm text-gray-500">or Login with</span>
              <hr className="w-[140px] border-t border-gray-200" />
            </div>
            <a href="https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email profile&access_type=offline">
              <div className="flex w-[400px] border-2 h-10 rounded-lg ml-5 items-center justify-center cursor-pointer transition-colors duration-200">
                <img
                  src="/images/google_icon.png"
                  className="w-8 flex items-center justify-center bg-white"
                  alt="Google Icon"
                />
                <p className="">Login with Google</p>
              </div>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
