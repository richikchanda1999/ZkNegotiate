/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useLayoutEffect, useState } from "react";
import DataConstructModal from "../components/DataConstructModal";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isConnected } = useAccount();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected]);

  useLayoutEffect(() => {}, []);
  return (
    <div className="flex h-full overflow-y-auto bg-gray-50 py-10 px-4 flex-col items-center">
      {/* Heading and Description */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Verifiable Negotiation
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-10">
        A negotiation agent that enables two or more parties to negotiate deals
        or agreements while keeping their preferences, constraints, and
        sensitive data private.
      </p>

      {/* Two Columns */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Column One */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <img
            src="/middle_ground.webp"
            alt="Column One Placeholder"
            className="object-cover rounded mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Finding Common Ground
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            Negotiating Without Compromising Privacy
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Start
          </button>
        </div>

        {/* Column Two */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <img
            src="/unified_consensus.webp"
            alt="Column Two Placeholder"
            className="object-cover rounded mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Unified Consensus
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            Achieving Agreement with Complete Privacy
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300 disabled:cursor-not-allowed" disabled>
            Start
          </button>
        </div>
      </div>
      <DataConstructModal isModalOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
      }} />
    </div>
  );
}
