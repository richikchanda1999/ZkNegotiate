'use client'

import React from 'react';
import { Button } from 'antd';
import { useConnect } from 'wagmi';

interface ConnectWalletButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

const Content: React.FC<ConnectWalletButtonProps> = ({ isLoading = false, disabled = false }) => {
    const { connectors, connect } = useConnect()

  return (
    <Button
      type="primary"
      className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 border-none rounded-lg shadow-md transition-all duration-300"
      onClick={() => {
        connect({connector: connectors[0]})
      }}
      loading={isLoading}
      disabled={disabled}
    >
      Connect Wallet
    </Button>
  );
};

export default Content;
