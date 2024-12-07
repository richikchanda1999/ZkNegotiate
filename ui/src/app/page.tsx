'use client'

import { useLayoutEffect } from "react";
import ConnectWalletButton from "./components/ConnectWalletButton";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter()

  useLayoutEffect(() => {
    if (isConnected) router.replace('/dashboard')
  }, [isConnected])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <ConnectWalletButton />
    </div>
  );
}
