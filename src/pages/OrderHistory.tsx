
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
import { AlertCircle, CheckCircle2, Clock, Search } from "lucide-react";
import { Order } from "@/types";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  useEffect(() => {
    // Mock data - will be replaced with Supabase query
    const mockOrders: Order[] = [
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
      {
        id: "3",
        customer_id: "123",
        agent_id: "456",
        service_type: "Errand",
        delivery_address: "Kapsoya",
        status: "Delivered",
        base_charge: 300,
        service_charge: 30,
        delivery_charge: 100,
        total_amount: 430,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
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
          <h1 className="text-2xl font-bold">Order History</h1>
          <Button 
            className="bg-doorrush-primary hover:bg-doorrush-dark"
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
        
        <Card>
          <CardContent className="p-6">
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
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
                    <div className="flex justify-between items-end">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Order #{order.id}</span>
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
                    className="text-doorrush-primary"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button
                    className="bg-doorrush-primary hover:bg-doorrush-dark"
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
