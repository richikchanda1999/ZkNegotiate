/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext, ReactNode } from "react";

interface StepsContextValue {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  jsonData: Record<string, any>;
  setJsonData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  negotiationID: string;
  setNegotiationID: React.Dispatch<React.SetStateAction<string>>;
  option: "enter" | "create";
  setOption: React.Dispatch<React.SetStateAction<"enter" | "create">>;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

export function StepsProvider({ children }: { children: ReactNode }) {
  const [negotiationID, setNegotiationID] = useState<string>("");
  const [option, setOption] = useState<"enter" | "create">("enter");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [jsonData, setJsonData] = useState<Record<string, any>>({});

  return (
    <StepsContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        jsonData,
        setJsonData,
        negotiationID,
        setNegotiationID,
        option,
        setOption,
      }}
    >
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
