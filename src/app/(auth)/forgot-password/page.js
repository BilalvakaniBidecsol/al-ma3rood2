"use client";
import Head from "next/head";
import React, { useState } from "react";
import { FaUnlockAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const Page = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return  (
    <>
      <Head>
        <title>Forget Password | Ma</title>
        <meta
          name="description"
          content="Forget your password securely on YourAppName. Enter your new password and confirm to regain access to your account."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-white p-10 w-full max-w-md text-center rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-6 text-4xl">
          <FaUnlockAlt />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter your new password below.
        </p>

        {/* Password Field */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <span
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <span
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          className="px-4 cursor-pointer border border-transparent rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white w-full py-2 bg-green-600 hover:bg-green-700 transition font-semibold"
        >
          Reset Password
        </button>
      </div>
    </div>
    </>
  );
};

export default Page;
