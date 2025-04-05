
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();
  
  // Determine the selected agent name
  const selectedAgentName = autoAssign 
    ? "Auto-assign" 
    : agents.find(a => a.id === orderData.agentId)?.full_name || "None selected";

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 space-y-3">
        <div className={cn(
          "flex justify-between",
          isMobile && "flex-col space-y-1"
        )}>
          <span className="text-muted-foreground">Service Type</span>
          <span className="font-medium">{orderData.serviceType}</span>
        </div>
        
        <div className={cn(
          "flex justify-between",
          isMobile && "flex-col space-y-1"
        )}>
          <span className="text-muted-foreground">Delivery Address</span>
          <span className="font-medium break-words">{orderData.deliveryAddress}</span>
        </div>
        
        {orderData.instructions && (
          <div className="pt-2 border-t">
            <span className="text-muted-foreground block mb-1">Additional Instructions</span>
            <span className="text-sm">{orderData.instructions}</span>
          </div>
        )}
      </div>
      
      <div className="border rounded-lg p-4 space-y-3">
        <div className={cn(
          "flex justify-between",
          isMobile && "flex-col space-y-1"
        )}>
          <span className="text-muted-foreground">Agent Selection</span>
          <span className="font-medium">{selectedAgentName}</span>
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
