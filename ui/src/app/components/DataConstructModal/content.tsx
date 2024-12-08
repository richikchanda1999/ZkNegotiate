import React from 'react';
import { useSteps } from './context';
import TabSteps from './TabSteps';
import Step1View from './StepsViews/Step1View';
import Step2View from './StepsViews/Step2View';
import Step3View from './StepsViews/Step3View';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const { currentStep, setCurrentStep, jsonData } = useSteps();

  const renderRightContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1View />;
      case 2:
        return <Step2View />;
      case 3:
        return <Step3View />;
      default:
        return <div className="p-4">Unknown Step</div>;
    }
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-gray-800">
      <div className="bg-white rounded-lg shadow-lg w-3/4 h-3/4 flex overflow-hidden">
        {/* Left Section: Steps + JSON */}
        <div className="w-2/5 border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <h2 className="text-xl font-bold mb-4">Steps</h2>
            <TabSteps />

            <h3 className="text-lg font-semibold mb-2">JSON Data</h3>
            <pre className="bg-gray-50 border border-gray-200 rounded p-2 text-sm overflow-auto">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Close
            </button>
          </div>
        </div>

        {/* Right Section: Dynamic Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            {renderRightContent()}
          </div>
          <div className="p-4 border-t border-gray-200 flex space-x-4 justify-end">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
