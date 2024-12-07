/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import { useSteps } from "../context";
import { useAccount } from "wagmi";

const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";

const get = async (blobId: string) => {
  const url = `${AGGREGATOR}/v1/${blobId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); // Or response.json() if the response is JSON
    return result;
  } catch (error) {
    // @ts-ignore
    console.error("Error:", error.message);
  }
};

export default function Step1View() {
  const { setCurrentStep, setJsonData, negotiationID, setNegotiationID, option, setOption} = useSteps();

  // State to track user choice and entered negotiation ID
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { address } = useAccount();

  const handleNext = async () => {
    setError("");

    if (option === "create") {
      // If creating a new negotiation, proceed and update JSON as needed
      setJsonData({
        initiatedBy: address,
      });
      setCurrentStep(2);
    } else {
      // If entering negotiation ID, check via canProceed
      if (!negotiationID.trim()) {
        setError("Please enter a negotiation ID.");
        return;
      }

      setLoading(true);
      const result = await get(negotiationID);
      setJsonData(result);
      setLoading(false);

      // Save the negotiation ID to JSON and move to next step
      setCurrentStep(2);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Step 1: Negotiation ID</h2>
      <div className="mb-4">
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="radio"
            value="enter"
            checked={option === "enter"}
            onChange={() => setOption("enter")}
          />
          <span>Enter an existing negotiation ID</span>
        </label>

        {option === "enter" && (
          <input
            type="text"
            className="border rounded p-2 w-full"
            placeholder="Enter negotiation ID"
            value={negotiationID}
            onChange={(e) => setNegotiationID(e.target.value)}
          />
        )}

        <label className="flex items-center space-x-2 mt-4">
          <input
            type="radio"
            value="create"
            checked={option === "create"}
            onChange={() => setOption("create")}
          />
          <span>Create a new negotiation</span>
        </label>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="mb-4">Checking negotiation ID...</p>}

      <button
        onClick={handleNext}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
      >
        Next
      </button>
    </div>
  );
}
