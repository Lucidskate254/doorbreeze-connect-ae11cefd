
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  QrCode,
  Truck,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order, Agent } from "@/types";
import QRCode from "qrcode.react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Try to fetch from Supabase first
        if (id) {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

          if (orderData && !orderError) {
            setOrder({
              id: orderData.id,
              customer_id: orderData.customer_id,
              agent_id: orderData.agent_id,
              service_type: orderData.service_type || 'Delivery',
              delivery_address: orderData.delivery_address,
              status: orderData.status,
              base_charge: orderData.amount || 200,
              service_charge: orderData.delivery_fee * 0.1 || 20,
              delivery_charge: orderData.delivery_fee || 60,
              total_amount: (orderData.amount || 200) + (orderData.delivery_fee || 60) + (orderData.delivery_fee * 0.1 || 20),
              created_at: orderData.created_at,
              updated_at: orderData.updated_at,
              instructions: orderData.description,
            });

            // If agent_id exists, fetch agent data
            if (orderData.agent_id) {
              const { data: agentData } = await supabase
                .from('agents')
                .select('*')
                .eq('id', orderData.agent_id)
                .single();

              if (agentData) {
                setAgent({
                  id: agentData.id,
                  full_name: agentData.full_name,
                  phone_number: agentData.phone_number,
                  online_status: agentData.online_status || false,
                  current_location: agentData.location,
                  rating: 4.8, // Default rating
                  profile_picture: agentData.profile_picture,
                });
              }
            }
            
            setLoading(false);
            return;
          }
        }

        // Fallback to mock data if Supabase fetch fails
        // Mock data - will be replaced with Supabase query
        setTimeout(() => {
          const mockOrder: Order = {
            id: id || "1",
            customer_id: "123",
            agent_id: "456",
            service_type: "Delivery",
            delivery_address: "Eldoret CBD",
            status: "In Transit",
            base_charge: 200,
            service_charge: 20,
            delivery_charge: 60,
            total_amount: 280,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            instructions: "Please be careful with the package, it's fragile.",
          };
          
          const mockAgent: Agent = {
            id: "456",
            full_name: "John Doe",
            phone_number: "0712345678",
            online_status: true,
            current_location: "Eldoret CBD",
            rating: 4.8,
            profile_picture: "",
          };
          
          setOrder(mockOrder);
          setAgent(mockAgent);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-800";
      case "Assigned": return "bg-blue-100 text-blue-800";
      case "In Transit": return "bg-purple-100 text-purple-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case "Pending": return <AlertCircle size={20} />;
      case "Assigned": return <Clock size={20} />;
      case "In Transit": return <Truck size={20} />;
      case "Delivered": return <CheckCircle2 size={20} />;
      case "Cancelled": return <AlertCircle size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSendTip = () => {
    if (!tipAmount || isNaN(Number(tipAmount)) || Number(tipAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid tip amount",
        variant: "destructive",
      });
      return;
    }
    
    // Mock API call - will be replaced with M-Pesa integration and Supabase
    toast({
      title: "Tip sent successfully",
      description: `KES ${tipAmount} has been sent to ${agent?.full_name}`,
    });
    
    setTipAmount("");
  };
  
  // Create a string representation of the order for QR code
  const orderQRData = order ? JSON.stringify({
    orderId: order.id,
    serviceType: order.service_type,
    deliveryAddress: order.delivery_address,
    amount: order.total_amount,
    customerName: order.customer_name || "Customer",
    customerPhone: order.customer_contact || "Phone",
    date: order.created_at,
  }) : "";

  if (loading) {
    return (
      <MainLayout title="Order Details">
        <div className="max-w-3xl mx-auto text-center py-10">
          <p>Loading order details...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!order) {
    return (
      <MainLayout title="Order Not Found">
        <div className="max-w-3xl mx-auto text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button onClick={() => navigate('/order-history')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Order History
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Order #${order.id}`} showBackButton={true}>
      <div className="max-w-3xl mx-auto animate-fade-in pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order Placed</p>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-medium ml-1">{order.status}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service Type</p>
                  <p className="font-medium">{order.service_type}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-doorrush-primary" />
                    <p>{order.delivery_address}</p>
                  </div>
                </div>
                
                {order.instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Instructions</p>
                    <p>{order.instructions}</p>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Order Summary</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Base Charge</span>
                      <span>KES {order.base_charge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Charge (10%)</span>
                      <span>KES {order.service_charge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>KES {order.delivery_charge.toFixed(2)}</span>
                    </div>
                    <div className="pt-1 border-t flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>KES {order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowQRCode(!showQRCode)}
                >
                  <QrCode size={16} />
                  {showQRCode ? "Hide QR Code" : "Show QR Code"}
                </Button>
              </div>
              
              {showQRCode && (
                <div className="flex justify-center mt-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <QRCode value={orderQRData} size={200} />
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                      Show this QR code to your agent for verification
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {agent && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Delivery Agent</h2>
                
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-muted rounded-full overflow-hidden flex-shrink-0">
                    {agent.profile_picture ? (
                      <img
                        src={agent.profile_picture}
                        alt={agent.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-doorrush-primary text-white">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{agent.full_name}</p>
                    <div className="flex items-center text-sm">
                      <span className={cn(
                        "inline-block w-2 h-2 rounded-full mr-1",
                        agent.online_status ? "bg-green-500" : "bg-red-500"
                      )}></span>
                      <span className="text-muted-foreground mr-2">
                        {agent.online_status ? "Online" : "Offline"}
                      </span>
                      <span>★ {agent.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = `tel:${agent.phone_number}`}>
                    <Phone size={16} className="mr-2" />
                    Call Agent
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/chat/${agent.id}`)}>
                    <MessageSquare size={16} className="mr-2" />
                    Chat with Agent
                  </Button>
                </div>
                
                {order.status === "Delivered" && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-2">Send a Tip</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="tipAmount">Amount (KES)</Label>
                        <Input
                          id="tipAmount"
                          type="number"
                          min="10"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                          placeholder="Enter tip amount"
                        />
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-full bg-doorrush-primary hover:bg-doorrush-dark" disabled={!tipAmount}>
                            Send Tip via M-Pesa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Tip</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to send KES {tipAmount} as a tip to {agent.full_name}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSendTip}>Confirm</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetail;
