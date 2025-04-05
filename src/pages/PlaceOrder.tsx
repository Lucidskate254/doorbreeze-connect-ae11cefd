
import React from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
} from "lucide-react";
import { useOrderForm } from "@/hooks/useOrderForm";
import OrderSteps from "@/components/order/OrderSteps";
import OrderDetailsForm from "@/components/order/OrderDetailsForm";
import AgentSelection from "@/components/order/AgentSelection";
import OrderSummary from "@/components/order/OrderSummary";

const PlaceOrder = () => {
  const {
    currentStep,
    orderData,
    agents,
    loading,
    error,
    autoAssign,
    isSubmitting,
    deliveryCharge,
    serviceCharge,
    totalAmount,
    handleServiceTypeChange,
    handleDeliveryAddressChange,
    handleInstructionsChange,
    handleAgentSelection,
    handleAutoAssignToggle,
    handleNextStep,
    handlePreviousStep,
    handleSubmitOrder
  } = useOrderForm();

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Place New Order</h1>
        
        <OrderSteps currentStep={currentStep} />
        
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Select service type and delivery address</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderDetailsForm
                serviceType={orderData.serviceType}
                deliveryAddress={orderData.deliveryAddress}
                instructions={orderData.instructions}
                onServiceTypeChange={handleServiceTypeChange}
                onDeliveryAddressChange={handleDeliveryAddressChange}
                onInstructionsChange={handleInstructionsChange}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-doorrush-primary hover:bg-doorrush-dark"
                onClick={handleNextStep}
              >
                Continue
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Agent</CardTitle>
              <CardDescription>Choose an available agent or let us assign one automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentSelection
                autoAssign={autoAssign}
                onAutoAssignToggle={handleAutoAssignToggle}
                selectedAgentId={orderData.agentId}
                onAgentSelection={handleAgentSelection}
                agents={agents}
                loading={loading}
                error={error}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
              >
                Back
              </Button>
              <Button 
                className="bg-doorrush-primary hover:bg-doorrush-dark"
                onClick={handleNextStep}
              >
                Continue
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details before confirming</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderSummary
                orderData={orderData}
                autoAssign={autoAssign}
                agents={agents}
                deliveryCharge={deliveryCharge}
                serviceCharge={serviceCharge}
                totalAmount={totalAmount}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                className="bg-doorrush-primary hover:bg-doorrush-dark"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Order"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default PlaceOrder;
