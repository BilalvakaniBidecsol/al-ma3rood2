import React from "react";
import { FiMail } from "react-icons/fi";


const page = () => {
  return (
 <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <FiMail className="text-6xl text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Kindly set your new password.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter new password"
          />
          {/* <p className="text-xs text-green-600 mt-1">Password strength: Excellent</p> */}
          {/* <div className="h-1 w-full bg-green-500 mt-1 rounded-lg"></div> */}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Re-enter password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Re-enter new password"
          />
        </div>

        <button
        className="px-4 cursor-pointer border border-transparent rounded-md shadow-sm text-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white w-full py-2  bg-green-600 hover:bg-green-700 transition font-semibold">
          Reset password
        </button>
      </div>
    </div>  )
}

export default page