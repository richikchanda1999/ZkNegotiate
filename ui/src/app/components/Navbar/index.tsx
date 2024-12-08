'use client'

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import LogoutButton from "./LogoutButton";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  return (
    <nav className="w-full bg-white shadow p-4 flex items-center relative h-16">
      {/* Left Section: Icon and Product Name */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {
        router.replace('/')
      }}>
        {/* Replace with your own icon/image */}
        <img
          src="/negotiate.webp"
          alt="Product icon Placeholder"
          className="h-12 w-12 object-cover rounded"
        />
        <span className="font-semibold text-gray-800 text-lg">
          Verifiable Negotiation
        </span>
      </div>

      {isConnected && <div className="absolute left-1/2 -translate-x-1/2 text-gray-700 text-sm">
        {address}
      </div>
}
      {/* Right Section: Buttons */}
      {isConnected && <div className="ml-auto flex space-x-6">
        <Link
          href="/history"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          View history
        </Link>
        <LogoutButton />
      </div>}
    </nav>
  );
}
