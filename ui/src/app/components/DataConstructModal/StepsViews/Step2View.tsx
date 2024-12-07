import React, { useState } from "react";
import { useSteps } from "../context";
import { useAccount } from "wagmi";

export default function Step2View() {
  const { setCurrentStep, setJsonData } = useSteps();
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [error, setError] = useState("");

  const { address } = useAccount();

  const handleNext = () => {
    setError("");

    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);

    if (isNaN(min) || isNaN(max) || min >= max) {
      setError("Please enter valid numeric values with min < max.");
      return;
    }

    setJsonData((prev) => {
      const ranges = Array.isArray(prev.ranges) ? [...prev.ranges] : [];
      const existingIndex = ranges.findIndex((range) => range.party === address);
    
      if (existingIndex !== -1) {
        // Found an existing party with the same address, update its limits
        const updatedRanges = [...ranges];
        updatedRanges[existingIndex] = {
          ...updatedRanges[existingIndex],
          lower_limit: min,
          upper_limit: max,
        };
        return {
          ...prev,
          ranges: updatedRanges,
        };
      } else {
        // No existing party found, push a new one
        ranges.push({ party: address, lower_limit: min, upper_limit: max });
        return {
          ...prev,
          ranges,
        };
      }
    });
    

    setCurrentStep(3);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Step 2: Enter Range</h2>
      <div className="mb-4">
        <label className="block mb-2">Minimum Value</label>
        <input
          type="number"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        />

        <label className="block mb-2">Maximum Value</label>
        <input
          type="number"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleNext}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
      >
        Next
      </button>
    </div>
  );
}
