/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from "react";
import DataConstructModal from "../components/DataConstructModal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex h-full overflow-y-auto bg-gray-50 py-10 px-4 flex-col items-center">
      {/* Heading and Description */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Welcome to the Dashboard
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-10">
        Here is a short description about the dashboard. Explore the sections
        below to learn more.
      </p>

      {/* Two Columns */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Column One */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <img
            src="https://via.placeholder.com/300x200"
            alt="Column One Placeholder"
            className="w-full h-40 object-cover rounded mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Column One
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            A brief description for the first section. This might contain
            details or highlights about some features.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300" onClick={() => {
            setIsModalOpen(true)
          }}>
            Learn More
          </button>
        </div>

        {/* Column Two */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <img
            src="https://via.placeholder.com/300x200"
            alt="Column Two Placeholder"
            className="w-full h-40 object-cover rounded mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Column Two
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            A brief description for the second section. This section might
            contain other important insights.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300">
            Learn More
          </button>
        </div>
      </div>
      <DataConstructModal isModalOpen={isModalOpen} onClose={() => {}} />
    </div>
  );
}
