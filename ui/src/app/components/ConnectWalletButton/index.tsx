"use client";

import { useAccount } from "wagmi";
import No from "./No";
import Content from "./Content";
import { useMemo } from "react";

export default function ConnectWalletButton() {
  const { isConnected } = useAccount();

  return useMemo(() => {
    if (isConnected) return <No />;
    else return <Content />;
  }, [isConnected]);
}
