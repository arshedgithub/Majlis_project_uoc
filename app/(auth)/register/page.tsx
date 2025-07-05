"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [fullname, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentPart, setCurrentPart] = useState<number>(1);

  const handleNext = () => {
    setCurrentPart(2);
  };

  const handleBack = () => {
    setCurrentPart(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle actual form submission logic here
      console.log({
        fullname,
        email,
        gender,
        faculty,
        degree,
        contact,
        password,
        confirmPassword
      });
      
      // Redirect or show success message
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="flex ml-[265px] -mt-2">
        <img
          src="/images/MajlisLogo.png"
          className="w-[30px] h-auto ml-10 mt-10"
          alt="Majlis Logo"
        />
        <h1 className="text-2xl font-bold ml-1 mt-10">
          Muslim Majlis - University of Colombo
        </h1>
      </div>

      {/* Main Form Container */}
      <div className="flex shadow-[0_0_15px_rgba(0,0,0,0.1)] w-3/5 h-[580px] mx-auto rounded-lg mt-1 overflow-hidden">
        {/* Left Card - Form */}
        <Card className="w-1/2 h-full rounded-l-lg flex flex-col rounded-r-none">
          <CardHeader className="p-8">
            <CardTitle className="text-3xl font-bold">Signup</CardTitle>
            <p className="text-sm text-gray-400">
              Signup to access your account
            </p>
          </CardHeader>

          <CardContent className="flex-1 p-8 space-y-6 -mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Part 1 - Basic Information */}
              {currentPart === 1 && (
                <div className="space-y-6">
                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="fullname"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Fullname
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      placeholder="Enter your fullname"
                      required
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-1 outline-none text-sm"
                    />
                  </div>

                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="email"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-1 outline-none text-sm"
                    />
                  </div>

                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="gender"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                      required
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="faculty"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Studied Faculty
                    </label>
                    <select
                      id="faculty"
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                      required
                    >
                      <option value="" disabled>
                        Select your faculty
                      </option>
                      <option value="UCSC">
                        University of Colombo School of Computing
                      </option>
                      <option value="FOS">Faculty of Science</option>
                      <option value="FOT">Faculty of Technology</option>
                      <option value="FOL">Faculty of Law</option>
                      <option value="FOA">Faculty of Arts</option>
                      <option value="UCFM">
                        University of Colombo Faculty of Medicine
                      </option>
                      <option value="FMF">
                        Faculty of Management and Finance
                      </option>
                    </select>
                  </div>

                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="degree"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Completed Degree Program
                    </label>
                    <input
                      type="text"
                      id="degree"
                      placeholder="Enter your degree program"
                      required
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full p-1 outline-none text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Part 2 - Contact & Security Information */}
              {currentPart === 2 && (
                <div className="space-y-6">
                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="contact"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contact"
                      placeholder="Enter your contact number"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
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

                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="confirmPassword"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-1 outline-none text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-bold text-gray-400 py-2 px-6 rounded-md transition-colors -mt-6"
                    >
                      ← Back
                    </button>
                    <p className="flex text-xs text-red-400 items-end justify-end">
                      <Link
                        href="/reset"
                        className="text-red-400 hover:underline font-bold"
                      >
                        Forgot password?
                      </Link>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 font-bold text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Signup"
                    )}
                  </button>
                </div>
              )}
            </form>
          </CardContent>

          {/* Footer (only shown in part 2) */}
          {currentPart === 2 && (
            <>
              <CardFooter className="flex items-center justify-center space-x-2">
                <p className="text-sm text-gray-500 font-bold">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-red-400 hover:underline font-bold"
                  >
                    Login
                  </Link>
                </p>
              </CardFooter>
              <div className="flex items-center justify-center my-6 -mt-1">
                <hr className="w-[140px] border-t border-gray-200" />
                <span className="px-4 text-sm text-gray-500">
                  or Login with
                </span>
                <hr className="w-[140px] border-t border-gray-200" />
              </div>
              <div className="flex w-full justify-center mb-6">
                <a href="https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email profile&access_type=offline">
                  <div className="flex w-[400px] border-2 h-10 rounded-lg items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-gray-50">
                    <img
                      src="/images/google_icon.png"
                      className="w-8 flex items-center justify-center bg-white"
                      alt="Google Icon"
                    />
                    <p className="ml-2">Login with Google</p>
                  </div>
                </a>
              </div>
            </>
          )}
        </Card>

        {/* Right Image Section */}
        <div
          className="w-1/2 h-full relative bg-[url(/images/signup1.png)] bg-cover bg-center"
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative w-full h-full">
            {/* Home button positioned at top-right */}
            <button className="absolute top-4 right-4 flex items-center justify-center gap-2 text-black w-[100px] h-[42px] bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
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

            {/* Centered content */}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-8">
              <h1 className="text-white text-3xl text-center font-bold">
                Join Our Ummah Circle
                <br />
                Your Voice Belongs Here
              </h1>
              <p className="text-white mt-4 text-center">
                Together in Faith, Stronger in Unity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}