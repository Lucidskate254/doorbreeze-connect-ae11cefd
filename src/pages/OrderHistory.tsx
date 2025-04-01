
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, Search, ArrowLeft } from "lucide-react";
import { Order } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setOrders([]);
          setFilteredOrders([]);
          return;
        }
        
        // Map database records to Order type
        const mappedOrders: Order[] = data.map(order => ({
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
        
        setOrders(mappedOrders);
        setFilteredOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // Set up real-time listener for order updates
    const channel = supabase
      .channel('orders-history')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
        }, 
        () => {
          console.log('Order data changed, refreshing history...');
          fetchOrders();
          
          // Vibration feedback for order update
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = orders;
    
    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        order =>
          order.id.toLowerCase().includes(query) ||
          order.service_type.toLowerCase().includes(query) ||
          order.delivery_address.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

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
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="mr-2 md:hidden"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Order History</h1>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/place-order')}
          >
            Place New Order
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card className="border-blue-100 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <p className="ml-2 text-sm text-muted-foreground">Loading orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-blue-100 rounded-lg p-4 hover:border-blue-400 hover:shadow-md hover:shadow-blue-50 cursor-pointer transition-all"
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
                    <div className="flex justify-between items-end">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Order #{order.id.substring(0, 8)}</span>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                      <span className="font-medium">KES {order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No orders found</p>
                {orders.length > 0 && filteredOrders.length === 0 ? (
                  <Button 
                    variant="link" 
                    className="text-blue-600"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/place-order')}
                  >
                    Place your first order
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
