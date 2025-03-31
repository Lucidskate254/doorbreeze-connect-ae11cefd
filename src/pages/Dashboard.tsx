
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";
import { ShoppingBag, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Order } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch orders from Supabase
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Get active orders (status not 'Delivered' or 'Cancelled')
        const { data: activeData, error: activeError } = await supabase
          .from('orders')
          .select('*')
          .not('status', 'in', '("Delivered","Cancelled")')
          .order('created_at', { ascending: false });
        
        if (activeError) throw activeError;
        
        // Get recent completed orders
        const { data: recentData, error: recentError } = await supabase
          .from('orders')
          .select('*')
          .in('status', '["Delivered","Cancelled"]')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentError) throw recentError;
        
        // Map database records to Order type
        const mapOrderData = (data: any[]): Order[] => {
          return data.map(order => ({
            id: order.id,
            customer_id: order.customer_id,
            agent_id: order.agent_id,
            service_type: "Delivery", // Default since this field doesn't exist in DB
            delivery_address: order.delivery_address,
            status: order.status,
            base_charge: order.amount || 0,
            service_charge: (order.amount || 0) * 0.1,
            delivery_charge: order.delivery_fee || 0,
            total_amount: (order.amount || 0) + (order.delivery_fee || 0) + ((order.amount || 0) * 0.1),
            created_at: order.created_at,
            updated_at: order.updated_at,
          }));
        };
        
        setActiveOrders(mapOrderData(activeData || []));
        setRecentOrders(mapOrderData(recentData || []));
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Set empty arrays on error
        setActiveOrders([]);
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // Set up real-time listener for order updates
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
        }, 
        () => {
          console.log('Order data changed, refreshing...');
          fetchOrders();
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      case "Pending": return <AlertCircle size={16} />;
      case "Assigned": return <Clock size={16} />;
      case "In Transit": return <Clock size={16} />;
      case "Delivered": return <CheckCircle2 size={16} />;
      case "Cancelled": return <AlertCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const renderOrderList = (orders: Order[], emptyMessage: string) => {
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
          <p className="text-muted-foreground">{emptyMessage}</p>
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
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span>{order.status}</span>
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
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hello, {customer?.full_name?.split(' ')[0] || 'Customer'}</h1>
            <p className="text-muted-foreground">Welcome to DoorRush</p>
          </div>
          <Button 
            className="bg-doorrush-primary hover:bg-doorrush-dark"
            onClick={() => navigate('/place-order')}
          >
            <ShoppingBag size={18} className="mr-2" />
            Place Order
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Orders</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/order-history')}
                >
                  View all
                </Button>
              </div>
              
              {renderOrderList(activeOrders, "No active orders")}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/order-history')}
                >
                  View all
                </Button>
              </div>
              
              {renderOrderList(recentOrders, "No order history")}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4">
              <h2 className="text-lg font-semibold mb-2">Need something delivered?</h2>
              <p className="text-muted-foreground mb-4">
                We're here to help with shopping, deliveries, and errands in Eldoret.
              </p>
              <Button 
                className="bg-doorrush-primary hover:bg-doorrush-dark"
                onClick={() => navigate('/place-order')}
              >
                <ShoppingBag size={18} className="mr-2" />
                Place New Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
