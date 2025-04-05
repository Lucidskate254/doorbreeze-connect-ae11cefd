
import React from "react";

interface OrderSummaryProps {
  orderData: {
    serviceType: string;
    deliveryAddress: string;
    instructions: string;
    agentId: string;
    baseCharge: number;
  };
  autoAssign: boolean;
  agents: any[];
  deliveryCharge: number;
  serviceCharge: number;
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderData,
  autoAssign,
  agents,
  deliveryCharge,
  serviceCharge,
  totalAmount,
}) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service Type</span>
          <span className="font-medium">{orderData.serviceType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Address</span>
          <span className="font-medium">{orderData.deliveryAddress}</span>
        </div>
        {orderData.instructions && (
          <div className="pt-2 border-t">
            <span className="text-muted-foreground block mb-1">Additional Instructions</span>
            <span className="text-sm">{orderData.instructions}</span>
          </div>
        )}
      </div>
      
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Agent Selection</span>
          <span className="font-medium">
            {autoAssign 
              ? "Auto-assign" 
              : agents.find(a => a.id === orderData.agentId)?.full_name || "None selected"}
          </span>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Charge</span>
          <span>KES {orderData.baseCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service Charge (10%)</span>
          <span>KES {serviceCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Charge</span>
          <span>KES {deliveryCharge.toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t flex justify-between font-semibold">
          <span>Total Amount</span>
          <span>KES {totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
