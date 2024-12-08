'use client'

import { useDisconnect } from "wagmi";

export default function LogoutButton() {
  const { disconnect } = useDisconnect()
  return (
    <button className="text-gray-700 hover:text-gray-900 transition-colors" onClick={() => disconnect}>
      Logout
    </button>
  );
}
