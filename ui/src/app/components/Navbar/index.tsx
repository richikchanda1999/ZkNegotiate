import Link from 'next/link';
import React from 'react';
import LogoutButton from './LogoutButton'

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow p-4 flex items-center relative h-16">
      {/* Left Section: Icon and Product Name */}
      <div className="flex items-center space-x-2">
        {/* Replace with your own icon/image */}
        <div className="h-6 w-6 bg-blue-500 rounded-full"></div> 
        <span className="font-semibold text-gray-800 text-lg">Product Name</span>
      </div>

      {/* Center: Ethereum Address */}
      <div className="absolute left-1/2 -translate-x-1/2 text-gray-700 text-sm">
        0x1234...abcd
      </div>

      {/* Right Section: Buttons */}
      <div className="ml-auto flex space-x-6">
        <Link 
          href="/history" 
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          View history
        </Link>
        <LogoutButton />
      </div>
    </nav>
  );
}
