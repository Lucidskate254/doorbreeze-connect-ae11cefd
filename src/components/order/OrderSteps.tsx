
import React from "react";

interface OrderStepsProps {
  currentStep: number;
}

const OrderSteps: React.FC<OrderStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center mb-6">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-doorrush-primary text-white' : 'bg-muted'}`}>
        1
      </div>
      <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-doorrush-primary' : 'bg-muted'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-doorrush-primary text-white' : 'bg-muted'}`}>
        2
      </div>
      <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-doorrush-primary' : 'bg-muted'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-doorrush-primary text-white' : 'bg-muted'}`}>
        3
      </div>
    </div>
  );
};

export default OrderSteps;
