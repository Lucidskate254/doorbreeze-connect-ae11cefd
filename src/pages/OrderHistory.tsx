import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";
import { Order } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const OrderHistory = () => {
  const { customer } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [customer]);

  // Add this function to map database order to our Order type
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
    };
  };

  // Update your fetchOrders function to use the mapping
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match our Order type
      const mappedOrders = (data || []).map(mapDBOrderToOrder);
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const renderOrderList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-doorrush-primary border-t-transparent"></div>
          <p className="ml-2 text-sm text-muted-foreground">Loading orders...</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No order history found.</p>
          <Button
            variant="link"
            className="mt-2 text-doorrush-primary"
            onClick={() => navigate('/place-order')}
          >
            Place your first order
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 hover:border-doorrush-primary cursor-pointer transition-colors"
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{order.service_type}</h3>
                <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Order #{order.id.substring(0, 8)}</span>
              <span className="font-medium">KES {order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MainLayout title="Order History" showBackButton={true}>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Order History</h1>
        {renderOrderList()}
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
