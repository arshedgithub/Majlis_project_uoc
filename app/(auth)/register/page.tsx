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
  const [userType, setUserType] = useState<"student" | "alumni">("student");
  const [fullname, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobDay, setDobDay] = useState<string>("");
  const [contact, setContact] = useState<string>("");

  // Common fields
  const [gender, setGender] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");

  // Student specific fields
  const [studentId, setStudentId] = useState<string>("");
  const [studyYear, setStudyYear] = useState<string>("");
  const [expectedGraduationYear, setExpectedGraduationYear] =
    useState<string>("");
  const [uniEmail, setUniEmail] = useState<string>("");

  // Alumni specific fields
  const [graduatedYear, setGraduatedYear] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [profession, setProfession] = useState<string>("");

  // Security fields
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentPart, setCurrentPart] = useState<number>(1);
  const [passwordError, setPasswordError] = useState<string>("");

  // Months array for date of birth
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Month map for numeric conversion
  const monthMap: { [key: string]: string } = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  // Generate days based on selected month and year
  const getDaysInMonth = () => {
    if (!dobYear || !dobMonth) return 31;
    const year = parseInt(dobYear);
    const month = months.indexOf(dobMonth) + 1;
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = Array.from({ length: getDaysInMonth() }, (_, i) => i + 1);

  // Validation functions for each part
  const isBasicInfoValid = () => {
    return (
      fullname.trim() !== "" &&
      email.trim() !== "" &&
      contact.trim() !== "" &&
      dobYear.trim() !== "" &&
      dobMonth.trim() !== "" &&
      dobDay.trim() !== ""
    );
  };

  const isAcademicInfoValid = () => {
    if (userType === "student") {
      return (
        studentId.trim() !== "" &&
        faculty.trim() !== "" &&
        studyYear.trim() !== "" &&
        gender.trim() !== ""
      );
    } else {
      return (
        graduatedYear.trim() !== "" &&
        degree.trim() !== "" &&
        faculty.trim() !== "" &&
        gender.trim() !== ""
      );
    }
  };

  const isAdditionalInfoValid = () => {
    if (userType === "student") {
      return expectedGraduationYear.trim() !== "";
    } else {
      return (
        profession.trim() !== "" &&
        password.length >= 8 &&
        password === confirmPassword
      );
    }
  };

  const isSecurityInfoValid = () => {
    return password.length >= 8 && password === confirmPassword;
  };

  // Additional DOB validation to ensure valid date
  const isDobValid = () => {
    if (!dobYear || !dobMonth || !dobDay) return false;
    const year = parseInt(dobYear);
    const month = months.indexOf(dobMonth) + 1;
    const day = parseInt(dobDay);
    const days = new Date(year, month, 0).getDate();
    return day <= days;
  };

  const handleNext = () => {
    if (currentPart === 1 && isBasicInfoValid() && isDobValid()) {
      setCurrentPart(2);
    } else if (currentPart === 2 && isAcademicInfoValid()) {
      setCurrentPart(3);
    } else if (
      currentPart === 3 &&
      isAdditionalInfoValid() &&
      userType === "student"
    ) {
      setCurrentPart(4);
    }
  };

  const handleBack = () => {
    if (currentPart > 1) {
      setCurrentPart(currentPart - 1);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    updatePasswordError(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    updatePasswordError(password, e.target.value);
  };

  const updatePasswordError = (pwd: string, confirm: string) => {
    if (pwd.length < 8 && pwd !== "") {
      setPasswordError("Password must be at least 8 characters");
    } else if (pwd !== confirm && confirm !== "") {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (userType === "alumni" && !isAdditionalInfoValid()) ||
      (userType === "student" && !isSecurityInfoValid()) ||
      !isDobValid()
    ) {
      return;
    }

    setLoading(true);

    try {
      const dobMonthNum = monthMap[dobMonth] || "";
      const dobDayPadded = dobDay.padStart(2, "0");
      const dob = `${dobYear}-${dobMonthNum}-${dobDayPadded}`;

      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log({
        userType,
        fullname,
        email,
        contact,
        dob,
        gender,
        ...(userType === "student"
          ? {
              studentId,
              faculty,
              studyYear,
              expectedGraduationYear,
              uniEmail,
            }
          : {
              graduatedYear,
              degree,
              profession,
              faculty,
            }),
        password,
      });
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

            {/* User Type Toggle */}
            <div className="flex items-center justify-center mt-4">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setUserType("student")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    userType === "student"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setUserType("alumni")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    userType === "alumni"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Alumni
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-8 space-y-6 -mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Progress Steps */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, ...(userType === "student" ? [4] : [])].map(
                    (step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            currentPart >= step
                              ? "bg-black text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step}
                        </div>
                        {step < (userType === "student" ? 4 : 3) && (
                          <div
                            className={`w-16 h-1 ${
                              currentPart > step ? "bg-black" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Part 1 - Basic Information */}
              {currentPart === 1 && (
                <div className="space-y-6">
                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="fullname"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      placeholder="Enter your full name"
                      required
                      value={fullname}
                      onChange={(e) => {
                        // Only allow English letters and spaces
                        const englishOnly = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        setFullName(englishOnly);
                      }}
                      className="w-full p-1 outline-none text-sm"
                    />
                  </div>

                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="email"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-1 outline-none text-sm"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address (e.g., user@example.com)"
                    />
                  </div>

                  <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                    <label
                      htmlFor="contact"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contact"
                      placeholder="Enter your phone number"
                      required
                      value={contact}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setContact(value);
                      }}
                      pattern="[0-9]{10}"
                      title="Please enter exactly 10 digits"
                      className="w-full p-1 outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                      <label
                        htmlFor="dob-year"
                        className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                      >
                        Year
                      </label>
                      <select
                        id="dob-year"
                        value={dobYear}
                        onChange={(e) => setDobYear(e.target.value)}
                        className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                        required
                      >
                        <option value="" disabled>
                          Year
                        </option>
                        {Array.from({ length: 100 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                      <label
                        htmlFor="dob-month"
                        className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                      >
                        Month
                      </label>
                      <select
                        id="dob-month"
                        value={dobMonth}
                        onChange={(e) => setDobMonth(e.target.value)}
                        className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                        required
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                      <label
                        htmlFor="dob-day"
                        className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                      >
                        Day
                      </label>
                      <select
                        id="dob-day"
                        value={dobDay}
                        onChange={(e) => setDobDay(e.target.value)}
                        className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                        required
                        disabled={!dobYear || !dobMonth}
                      >
                        <option value="" disabled>
                          Day
                        </option>
                        {daysInMonth.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {!isDobValid() && dobDay && (
                    <p className="text-red-500 text-sm -mt-4">
                      Invalid date for selected month/year
                    </p>
                  )}

                  <div className="flex justify-between pt-4">
                    <div></div>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isBasicInfoValid() || !isDobValid()}
                      className={`py-2 px-6 rounded-md transition-colors ${
                        isBasicInfoValid() && isDobValid()
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Part 2 - Academic Information */}
              {currentPart === 2 && (
                <div className="space-y-6">
                  {/* Gender Field */}
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
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Student Specific Fields */}
                  {userType === "student" && (
                    <>
                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="studentId"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Student ID Number
                        </label>
                        <input
                          type="text"
                          id="studentId"
                          placeholder="Enter your student ID"
                          required
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          className="w-full p-1 outline-none text-sm"
                        />
                      </div>

                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="faculty"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Department/Faculty
                        </label>
                        <select
                          id="faculty"
                          value={faculty}
                          onChange={(e) => setFaculty(e.target.value)}
                          className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                          required
                        >
                          <option value="" disabled>
                            Select faculty
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
                          htmlFor="studyYear"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Year of Study
                        </label>
                        <select
                          id="studyYear"
                          value={studyYear}
                          onChange={(e) => setStudyYear(e.target.value)}
                          className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                          required
                        >
                          <option value="" disabled>
                            Select year
                          </option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Alumni Specific Fields */}
                  {userType === "alumni" && (
                    <>
                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="graduatedYear"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Graduation Year
                        </label>
                        <select
                          id="graduatedYear"
                          value={graduatedYear}
                          onChange={(e) => setGraduatedYear(e.target.value)}
                          className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                          required
                        >
                          <option value="" disabled>
                            Select year
                          </option>
                          {Array.from({ length: 50 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="degree"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Degree Obtained
                        </label>
                        <input
                          type="text"
                          id="degree"
                          placeholder="e.g., B.Sc Computer Science"
                          required
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full p-1 outline-none text-sm"
                        />
                      </div>

                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="faculty"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Department/Faculty
                        </label>
                        <select
                          id="faculty"
                          value={faculty}
                          onChange={(e) => setFaculty(e.target.value)}
                          className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                          required
                        >
                          <option value="" disabled>
                            Select faculty
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
                    </>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-bold text-gray-600 py-2 px-6 rounded-md transition-colors hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isAcademicInfoValid()}
                      className={`py-2 px-6 rounded-md transition-colors ${
                        isAcademicInfoValid()
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Part 3 - Additional Information */}
              {currentPart === 3 && (
                <div className="space-y-6">
                  {userType === "student" ? (
                    <>
                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="expectedGraduationYear"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Expected Graduation Year
                        </label>
                        <select
                          id="expectedGraduationYear"
                          value={expectedGraduationYear}
                          onChange={(e) =>
                            setExpectedGraduationYear(e.target.value)
                          }
                          className="w-full p-1 outline-none appearance-none bg-transparent text-sm"
                          required
                        >
                          <option value="" disabled>
                            Select year
                          </option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="uniEmail"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          University Email (if applicable)
                        </label>
                        <input
                          type="email"
                          id="uniEmail"
                          placeholder="Enter your university email"
                          value={uniEmail}
                          onChange={(e) => setUniEmail(e.target.value)}
                          className="w-full p-1 outline-none text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative border border-gray-300 rounded-md pt-1 pb-0 px-1 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 h-[42px]">
                        <label
                          htmlFor="profession"
                          className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600"
                        >
                          Current Profession
                        </label>
                        <input
                          type="text"
                          id="profession"
                          placeholder="e.g., Software Engineer"
                          required
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
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
                          placeholder="Enter your password (min 8 characters)"
                          required
                          minLength={8}
                          value={password}
                          onChange={handlePasswordChange}
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
                          onChange={handleConfirmPasswordChange}
                          className="w-full p-1 outline-none text-sm"
                        />
                      </div>

                      {passwordError && (
                        <p className="text-red-500 text-sm -mt-4">
                          {passwordError}
                        </p>
                      )}
                    </>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-bold text-gray-600 py-2 px-6 rounded-md transition-colors hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    {userType === "student" ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isAdditionalInfoValid()}
                        className={`py-2 px-6 rounded-md transition-colors ${
                          isAdditionalInfoValid()
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading || !isAdditionalInfoValid()}
                        className={`py-2 px-6 rounded-md transition-colors ${
                          !loading && isAdditionalInfoValid()
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                    )}
                  </div>
                </div>
              )}

              {/* Part 4 - Security Information (Students Only) */}
              {currentPart === 4 && userType === "student" && (
                <div className="space-y-6">
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
                      placeholder="Enter your password (min 8 characters)"
                      required
                      minLength={8}
                      value={password}
                      onChange={handlePasswordChange}
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
                      onChange={handleConfirmPasswordChange}
                      className="w-full p-1 outline-none text-sm"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-red-500 text-sm -mt-4">
                      {passwordError}
                    </p>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-bold text-gray-600 py-2 px-6 rounded-md transition-colors hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !isSecurityInfoValid()}
                      className={`py-2 px-6 rounded-md transition-colors ${
                        !loading && isSecurityInfoValid()
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                </div>
              )}
            </form>
          </CardContent>

          {/* Footer (only shown in part 4 for students) */}
          {currentPart === (userType === "student" ? 4 : 3) && (
            <CardFooter className="flex items-center justify-center space-x-2 -mt-[30px]">
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
