/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useLayoutEffect, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

interface BlobResponse {
  blobIds: string[];
}

export default function History() {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const [blobIds, setBlobIds] = useState<string[]>([]);
  const [expandedBlob, setExpandedBlob] = useState<string | null>(null);
  const [blobData, setBlobData] = useState<Record<string, any> | null>(null);

  useLayoutEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected, router]);

  // Fetch list of blobIds after we know the user is connected and we have an address
  useEffect(() => {
    if (isConnected && address) {
      const fetchBlobIds = async () => {
        try {
          const response = await fetch(
            `http://localhost:6060/blobs/${address}`,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result: BlobResponse = await response.json();
          setBlobIds(result.blobIds || []);
        } catch (error: any) {
          console.error("Error fetching blob IDs:", error.message);
        }
      };

      fetchBlobIds();
    }
  }, [isConnected, address]);

  const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";

  // Fetch and show JSON for a blob
  const fetchBlobData = async (blobId: string) => {
    const url = `${AGGREGATOR}/v1/${blobId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Or response.json() if the response is JSON
      setBlobData(result);
      setExpandedBlob(blobId);
    } catch (error: any) {
      console.error("Error fetching blob data:", error.message);
      setBlobData(null);
      setExpandedBlob(null);
    }
  };

  const handleBlobClick = (blobId: string) => {
    if (expandedBlob === blobId) {
      // If it's already expanded, collapse it
      setExpandedBlob(null);
      setBlobData(null);
    } else {
      // Fetch and expand
      fetchBlobData(blobId);
    }
  };

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

      <div className="w-full max-w-5xl mb-10 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Your Blob IDs</h2>
        {blobIds.length === 0 && <p>No blob IDs found.</p>}
        <ul className="space-y-2">
          {blobIds.map((id) => (
            <li
              key={id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
            >
              <div
                onClick={() => handleBlobClick(id)}
                className="flex justify-between items-center"
              >
                <span className="text-gray-800 font-medium break-all">
                  {id}
                </span>
                <span className="text-blue-500 hover:underline">
                  {expandedBlob === id ? "Hide Data" : "Show Data"}
                </span>
              </div>
              {expandedBlob === id && blobData && (
                <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-auto max-h-64">
                  {JSON.stringify(blobData, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
