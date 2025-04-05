
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  calculateDeliveryCharge,
  calculateServiceCharge,
  calculateTotalAmount,
  Agent
} from "@/types";
import { fetchAgents, subscribeToAgentStatusChanges, getRandomOnlineAgent } from "@/utils/agentUtils";
import { vibrate } from "@/utils/vibrationUtils";
import { placeOrder } from "@/services/customerService";

export const useOrderForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customer } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    serviceType: "",
    deliveryAddress: "",
    baseCharge: 200, // Default base charge
    instructions: "",
    agentId: "",
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoAssign, setAutoAssign] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allAgents = await fetchAgents();
        setAgents(allAgents);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError("Failed to load available agents. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAgents();
    
    const cleanup = subscribeToAgentStatusChanges(() => {
      loadAgents();
    });
    
    return cleanup;
  }, []);

  const handleServiceTypeChange = (value: string) => {
    setOrderData((prev) => ({ ...prev, serviceType: value }));
  };

  const handleDeliveryAddressChange = (value: string) => {
    setOrderData((prev) => ({ ...prev, deliveryAddress: value }));
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrderData((prev) => ({ ...prev, instructions: e.target.value }));
  };

  const handleAgentSelection = (agentId: string) => {
    setOrderData((prev) => ({ ...prev, agentId }));
    setAutoAssign(false);
    vibrate(50); // Subtle feedback when selecting agent
  };

  const handleAutoAssignToggle = () => {
    if (!autoAssign) {
      setOrderData((prev) => ({ ...prev, agentId: "" }));
    }
    setAutoAssign(!autoAssign);
    vibrate(50); // Subtle feedback
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!orderData.serviceType || !orderData.deliveryAddress) {
        vibrate(200); // Error vibration
        toast({
          title: "Missing information",
          description: "Please complete all required fields",
          variant: "destructive",
        });
        return;
      }
    }
    
    vibrate([30, 20, 30]); // Success pattern
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    vibrate(50); // Subtle feedback
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmitOrder = async () => {
    if (!customer) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let selectedAgentId = orderData.agentId;
      
      if (autoAssign) {
        const randomAgent = await getRandomOnlineAgent();
        if (randomAgent) {
          selectedAgentId = randomAgent.id;
        } else {
          throw new Error("No online agents available for auto-assignment");
        }
      }
      
      const deliveryCharge = calculateDeliveryCharge(orderData.deliveryAddress);
      const serviceCharge = calculateServiceCharge(orderData.baseCharge);
      
      const result = await placeOrder(
        customer.id,
        customer.full_name,
        customer.phone_number,
        {
          agent_id: selectedAgentId || undefined,
          delivery_address: orderData.deliveryAddress,
          amount: orderData.baseCharge,
          delivery_fee: deliveryCharge,
          description: orderData.instructions || `${orderData.serviceType} order`,
        }
      );
      
      if (!result.success) {
        throw new Error(result.error || "Failed to place order");
      }
      
      vibrate([100, 50, 100]); // Success vibration pattern
      
      toast({
        title: "Order placed successfully",
        description: "An agent will be assigned to your order shortly",
      });
      
      navigate("/order-confirmation", { 
        state: { 
          orderId: result.orderId,
          orderData: {
            ...orderData,
            serviceType: orderData.serviceType
          },
          deliveryCharge,
          serviceCharge,
          totalAmount: calculateTotalAmount(
            orderData.baseCharge,
            serviceCharge,
            deliveryCharge
          )
        } 
      });
    } catch (err) {
      console.error("Error submitting order:", err);
      
      vibrate(300); // Error vibration
      
      toast({
        title: "Order submission failed",
        description: err instanceof Error ? err.message : "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryCharge = calculateDeliveryCharge(orderData.deliveryAddress);
  const serviceCharge = calculateServiceCharge(orderData.baseCharge);
  const totalAmount = calculateTotalAmount(orderData.baseCharge, serviceCharge, deliveryCharge);

  return {
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
  };
};
