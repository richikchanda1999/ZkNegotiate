import React from 'react';
import { useSteps } from './context';

const steps = [
  { id: 1, label: "Step 1: Negotiation ID" },
  { id: 2, label: "Step 2: Enter range" },
  { id: 3, label: "Step 3: Upload to Walrus" },
];

export default function TabSteps() {
  const { currentStep, setCurrentStep } = useSteps();

  return (
    <ul className="space-y-2 mb-8">
      {steps.map(step => (
        <li
          key={step.id}
          className={`p-2 rounded cursor-pointer ${
            step.id === currentStep
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setCurrentStep(step.id)}
        >
          {step.label}
        </li>
      ))}
    </ul>
  );
}
