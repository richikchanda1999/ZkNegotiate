/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface StepsContextValue {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  jsonData: Record<string, any>;
  setJsonData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

export function StepsProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [jsonData, setJsonData] = useState<Record<string, any>>({
    step1Data: "Data from step 1",
  });

  return (
    <StepsContext.Provider value={{ currentStep, setCurrentStep, jsonData, setJsonData }}>
      {children}
    </StepsContext.Provider>
  );
}

export function useSteps() {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error("useSteps must be used within a StepsProvider");
  }
  return context;
}
