
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderStepsProps {
  currentStep: number;
}

const OrderSteps: React.FC<OrderStepsProps> = ({ currentStep }) => {
  const isMobile = useIsMobile();
  
  // Mobile-specific compact labels
  const stepLabels = isMobile
    ? ["Info", "Agent", "Pay"]
    : ["Order Details", "Agent Selection", "Payment & Confirm"];

  return (
    <div className="flex items-center mb-6">
      <div className={`flex flex-col items-center ${isMobile ? 'w-10' : 'w-12'}`}>
        <div className={`flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${currentStep >= 1 ? 'bg-doorrush-primary text-white' : 'bg-muted'}`}>
          1
        </div>
        {!isMobile && <span className="text-xs mt-1 text-center">{stepLabels[0]}</span>}
      </div>
      
      <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-doorrush-primary' : 'bg-muted'}`}></div>
      
      <div className={`flex flex-col items-center ${isMobile ? 'w-10' : 'w-12'}`}>
        <div className={`flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${currentStep >= 2 ? 'bg-doorrush-primary text-white' : 'bg-muted'}`}>
          2
        </div>
        {!isMobile && <span className="text-xs mt-1 text-center">{stepLabels[1]}</span>}
      </div>
      
      <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-doorrush-primary' : 'bg-muted'}`}></div>
      
      <div className={`flex flex-col items-center ${isMobile ? 'w-10' : 'w-12'}`}>
        <div className={`flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${currentStep >= 3 ? 'bg-doorrush-primary text-white' : 'bg-muted'}`}>
          3
        </div>
        {!isMobile && <span className="text-xs mt-1 text-center">{stepLabels[2]}</span>}
      </div>
    </div>
  );
};

export default OrderSteps;
