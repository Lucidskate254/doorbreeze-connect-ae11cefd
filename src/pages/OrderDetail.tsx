
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
  
  const mapDBOrderToOrder = (dbOrder: any): Order => {
    return {
      id: dbOrder.id,
      customer_id: dbOrder.customer_id,
      agent_id: dbOrder.agent_id,
      service_type: 'Delivery', // Default since this field doesn't exist in DB
      delivery_address: dbOrder.delivery_address,
      status: dbOrder.status as Order['status'], // Type cast to ensure it matches the enum
      base_charge: dbOrder.amount || 0,
      service_charge: (dbOrder.amount || 0) * 0.1,
      delivery_charge: dbOrder.delivery_fee || 0,
      total_amount: (dbOrder.amount || 0) + (dbOrder.delivery_fee || 0) + ((dbOrder.amount || 0) * 0.1),
      created_at: dbOrder.created_at,
      updated_at: dbOrder.updated_at,
      customer_name: dbOrder.customer_name,
      customer_contact: dbOrder.customer_contact,
    };
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();
          
        if (orderError) throw orderError;
        
        if (!orderData) {
          console.error("Order not found:", id);
          setLoading(false);
          return;
        }
        
        const mappedOrder = mapDBOrderToOrder(orderData);
        
        setOrder(mappedOrder);
        
        if (orderData.agent_id) {
          const { data: agentData, error: agentError } = await supabase
            .from('agents')
            .select('id, full_name, phone_number, profile_picture, location, agent_code, online_status')
            .eq('id', orderData.agent_id)
            .single();
            
          if (!agentError && agentData) {
            const mappedAgent: Agent = {
              id: agentData.id,
              full_name: agentData.full_name,
              phone_number: agentData.phone_number,
              profile_picture: agentData.profile_picture || "",
              online_status: agentData.online_status || false,
              location: agentData.location || "Unknown", // Changed from current_location to location
              rating: 4.8, // Default rating
              agent_code: agentData.agent_code,
            };
            
            setAgent(mappedAgent);
          }
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
    
    const channel = supabase
      .channel('order-updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `id=eq.${id}`,
        }, 
        () => {
          console.log('Order updated, refreshing data...');
          fetchOrderData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
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
  
  const handleSendTip = async () => {
    if (!tipAmount || isNaN(Number(tipAmount)) || Number(tipAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid tip amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!agent || !order) {
      toast({
        title: "Cannot send tip",
        description: "Missing agent or order information",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tips')
        .insert({
          agent_id: agent.id,
          customer_id: order.customer_id,
          amount: Number(tipAmount)
        });
        
      if (error) throw error;
      
      toast({
        title: "Tip sent successfully",
        description: `KES ${tipAmount} has been sent to ${agent.full_name}`,
      });
      
      setTipAmount("");
    } catch (err) {
      console.error("Error sending tip:", err);
      toast({
        title: "Failed to send tip",
        description: "There was an error processing your tip. Please try again.",
        variant: "destructive",
      });
    }
  };
  
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
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-doorrush-primary border-t-transparent"></div>
            <p className="ml-2">Loading order details...</p>
          </div>
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
    <MainLayout title={`Order #${order.id.substring(0, 8)}`} showBackButton={true}>
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
          
          {agent ? (
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
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="font-semibold mb-4">Delivery Agent</h2>
                <p className="text-muted-foreground">
                  No agent has been assigned to this order yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetail;
