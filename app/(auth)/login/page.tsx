"use client";

import { useState } from "react";
import Link from "next/link";

export default function login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
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
                username: email, 
                password: password,
            }),
        });

        const data = await response.json();
        
        setLoading(false);

        if (response.ok) {
            alert("Login successfully");
            window.location.href = "/dashboard";
        } else {
            alert(data.message || "Invalid credentials.");
        }
    } catch (error) {
        setLoading(false);
        alert("An error occurred while logging in. Please try again.");
        console.error("Login error:", error);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-900"></div>
          <p className="text-gray-950 mt-4 text-lg">Loading...</p>
        </div>
      ) : (
        <div className="bg-[#ffffff] p-10 rounded-xl shadow-2xl max-w-md w-full relative">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
            Login
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                pattern="[a-zA-Z0-9]+"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="JohnDoe"
                required
                className="mt-2 block w-full py-1 px-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 text-gray-800 placeholder-gray-600"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="mt-2 block w-full py-1 px-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 text-gray-800 placeholder-gray-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold text-sm hover:from-gray-800 hover:to-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Forgot your password?{" "}
            <Link
              href="/reset"
              className="text-gray-800 hover:underline font-bold"
            >
              Reset it here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
