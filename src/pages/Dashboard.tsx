
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";
import { ShoppingBag, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Order } from "@/types";

const Dashboard = () => {
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Mock data - will be replaced with Supabase queries
    setActiveOrders([
      {
        id: "1",
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
      },
    ]);
    
    setRecentOrders([
      {
        id: "2",
        customer_id: "123",
        agent_id: "789",
        service_type: "Shopping",
        delivery_address: "Langas",
        status: "Delivered",
        base_charge: 500,
        service_charge: 50,
        delivery_charge: 100,
        total_amount: 650,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
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

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hello, {customer?.full_name?.split(' ')[0]}</h1>
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
              
              {activeOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
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
                        <span>Order #{order.id}</span>
                        <span className="font-medium">KES {order.total_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No active orders</p>
                  <Button
                    variant="link"
                    className="mt-2 text-doorrush-primary"
                    onClick={() => navigate('/place-order')}
                  >
                    Place your first order
                  </Button>
                </div>
              )}
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
              
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
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
                        <span>Order #{order.id}</span>
                        <span className="font-medium">KES {order.total_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No order history</p>
                  <Button
                    variant="link"
                    className="mt-2 text-doorrush-primary"
                    onClick={() => navigate('/place-order')}
                  >
                    Place your first order
                  </Button>
                </div>
              )}
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
