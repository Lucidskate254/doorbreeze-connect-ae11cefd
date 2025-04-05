import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Building,
  ShoppingBag,
  Truck,
  ClipboardList,
  Info,
  MapPin,
  RadioTower,
  AlertCircle,
} from "lucide-react";
import { 
  ELDORET_LOCATIONS, 
  SERVICE_TYPES, 
  calculateDeliveryCharge,
  calculateServiceCharge,
  calculateTotalAmount,
  Agent
} from "@/types";
import { fetchOnlineAgents, fetchAgents, getRandomOnlineAgent, subscribeToAgentStatusChanges } from "@/utils/agentUtils";
import { useAuth } from "@/contexts/AuthContext";
import { vibrate } from "@/utils/vibrationUtils";
import { placeOrder } from "@/services/customerService";

const PlaceOrder = () => {
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

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Place New Order</h1>
        
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
        
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Select service type and delivery address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={orderData.serviceType} onValueChange={handleServiceTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          {type.value === "Shopping" && <ShoppingBag size={16} className="mr-2" />}
                          {type.value === "Delivery" && <Truck size={16} className="mr-2" />}
                          {type.value === "Errand" && <ClipboardList size={16} className="mr-2" />}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address (Within Eldoret)</Label>
                <Select value={orderData.deliveryAddress} onValueChange={handleDeliveryAddressChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery location" />
                  </SelectTrigger>
                  <SelectContent>
                    {ELDORET_LOCATIONS.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        <div className="flex items-center">
                          {location.isCBD ? (
                            <Building size={16} className="mr-2" />
                          ) : (
                            <MapPin size={16} className="mr-2" />
                          )}
                          {location.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter any specific instructions or details for your order"
                  value={orderData.instructions}
                  onChange={handleInstructionsChange}
                />
              </div>
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
            <CardContent className="space-y-4">
              <div className="flex items-center mb-4">
                <Button
                  variant={autoAssign ? "default" : "outline"} 
                  className={autoAssign ? "bg-doorrush-primary hover:bg-doorrush-dark" : ""}
                  onClick={handleAutoAssignToggle}
                >
                  <RadioTower size={16} className="mr-2" />
                  Auto-assign
                </Button>
                <Button
                  variant={!autoAssign ? "default" : "outline"}
                  className={!autoAssign ? "bg-doorrush-primary hover:bg-doorrush-dark ml-2" : "ml-2"}
                  onClick={handleAutoAssignToggle}
                >
                  Manual select
                </Button>
              </div>
              
              {!autoAssign && (
                <div className="space-y-2">
                  <Label>Available Agents</Label>
                  
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-doorrush-primary border-t-transparent"></div>
                      <p className="ml-2 text-sm text-muted-foreground">Loading agents...</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle size={18} className="text-red-500 mt-0.5 mr-2" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}
                  
                  {!loading && !error && (
                    <div className="grid grid-cols-1 gap-3">
                      {agents.length > 0 ? (
                        agents.map(agent => (
                          <div
                            key={agent.id}
                            className={`border rounded-lg p-3 flex items-center cursor-pointer transition-colors ${
                              orderData.agentId === agent.id 
                                ? "border-doorrush-primary bg-doorrush-light"
                                : "hover:border-doorrush-primary"
                            }`}
                            onClick={() => handleAgentSelection(agent.id)}
                          >
                            <div className="h-10 w-10 bg-muted rounded-full overflow-hidden flex-shrink-0">
                              {agent.profile_picture ? (
                                <img
                                  src={agent.profile_picture}
                                  alt={agent.full_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-doorrush-primary text-white">
                                  {agent.full_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="font-medium">{agent.full_name}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <span className={`h-2 w-2 rounded-full ${agent.online_status ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
                                  {agent.online_status ? 'Online' : 'Offline'}
                                </span>
                                <span className="mx-2">•</span>
                                <span>{agent.location}</span>
                                <span className="mx-2">•</span>
                                <span>★ {agent.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border rounded-lg p-8 text-center">
                          <div className="flex flex-col items-center">
                            <Info size={24} className="mb-2 text-muted-foreground" />
                            <p className="font-medium">No agents found</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Please try again or use auto-assign mode
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {autoAssign && (
                <div className="border rounded-lg p-4 bg-muted">
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 text-doorrush-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Automatic Assignment</p>
                      <p className="text-sm text-muted-foreground">
                        We'll assign an available agent to your order. You'll be notified once an agent accepts your order.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
            <CardContent className="space-y-4">
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
