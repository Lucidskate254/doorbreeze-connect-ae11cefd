
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Check, Clock, QrCode, Home } from "lucide-react";
import QRCode from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (location.state?.orderId) {
      setOrder({
        id: location.state.orderId,
        ...location.state.orderData,
        deliveryCharge: location.state.deliveryCharge,
        serviceCharge: location.state.serviceCharge,
        totalAmount: location.state.totalAmount,
        status: "Pending",
        created_at: new Date().toISOString(),
      });

      // Verify order exists in database
      const checkOrderInDatabase = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', location.state.orderId)
            .single();
            
          if (error || !data) {
            console.error("Error verifying order:", error);
            toast({
              title: "Order verification failed",
              description: "Could not verify your order in our system",
              variant: "destructive",
            });
            navigate("/dashboard");
          } else {
            console.log("Order verified in database:", data);
          }
        } catch (err) {
          console.error("Order verification error:", err);
        } finally {
          setIsLoading(false);
        }
      };
      
      checkOrderInDatabase();

      // Try to play a notification sound for order placed
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(error => {
          console.log("Audio playback error (may be expected if user hasn't interacted with page):", error);
        });
      } catch (error) {
        console.log("Audio creation/playback error:", error);
      }
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate, toast]);

  if (!order) {
    return (
      <MainLayout showBackButton={false} title="Order Confirmation">
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-doorrush-primary border-t-transparent"></div>
          <p className="ml-3">Loading order details...</p>
        </div>
      </MainLayout>
    );
  }

  // Create a string representation of the order for QR code
  const orderQRData = JSON.stringify({
    orderId: order.id,
    serviceType: order.serviceType,
    deliveryAddress: order.deliveryAddress,
    amount: order.totalAmount,
    date: order.created_at,
  });

  return (
    <MainLayout showBackButton={false} title="Order Confirmation">
      <div className="max-w-lg mx-auto text-center py-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 animate-pulse-scale">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Your order has been received and is being processed.
        </p>
        
        <div className="bg-muted p-6 rounded-lg mb-8">
          <div className="text-sm font-medium mb-1">Order ID</div>
          <div className="text-xl font-bold mb-4">{order.id}</div>
          
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-lg inline-block">
              <QRCode value={orderQRData} size={150} />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-4">
            Show this QR code to your agent for order verification
          </p>
          
          <div className="text-left space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Type</span>
              <span className="font-medium">{order.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Address</span>
              <span className="font-medium">{order.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium">KES {order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-doorrush-primary font-medium">
            <Clock size={16} />
            <span>Estimated delivery time: 30-45 minutes</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <QrCode size={16} className="mr-2" />
            View Order Details
          </Button>
          
          <Button 
            className="flex-1 bg-doorrush-primary hover:bg-doorrush-dark"
            onClick={() => navigate("/dashboard")}
          >
            <Home size={16} className="mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmation;
