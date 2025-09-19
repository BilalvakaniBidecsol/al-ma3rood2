"use client";
import React, { useState } from "react";
import { FaUnlockAlt } from "react-icons/fa";

const page = () => {
  // const [email, setEmail] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Password reset link sent to:", email);
  //   // Yahan tum backend/Firebase API call karoge
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-white p-10  w-full max-w-md text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-6 text-4xl">
          <FaUnlockAlt />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Forgot your password?
        </h2>
        <p className="text-gray-600 text-[14px] mb-6">
          Enter your email to proceed.{" "}
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="e.g. username@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        {/* Send Email Button */}
        <button 
        className="px-4 cursor-pointer border border-transparent rounded-md shadow-sm text-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white w-full py-2  bg-green-600 hover:bg-green-700 transition font-semibold">
          Send Email
        </button>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-green-600 hover:underline flex items-center justify-center gap-1"
        >
          <span>&larr;</span> Back to Login
        </button>
      </div>
    </div>
  );
};

export default page;
