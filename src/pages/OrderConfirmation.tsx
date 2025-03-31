
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Check, Clock, QrCode, Home } from "lucide-react";
import QRCode from "qrcode.react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  
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
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate]);

  if (!order) {
    return null;
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
    <MainLayout>
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
