
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Package, Truck, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order_placed' | 'order_confirmed' | 'order_delivered' | 'system';
  isRead: boolean;
  timestamp: Date;
  orderId?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Function to fetch notifications
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Fetch orders to generate notifications from
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        if (!orders || orders.length === 0) {
          setNotifications([]);
          return;
        }
        
        // Generate notifications from orders
        const generatedNotifications: Notification[] = orders.flatMap((order, index) => {
          const notifications: Notification[] = [];
          
          // Order placed notification
          notifications.push({
            id: `${order.id}-placed`,
            title: 'Order Placed',
            message: `Your order #${order.id.substring(0, 8)} has been successfully placed`,
            type: 'order_placed',
            isRead: index > 1, // First couple are unread
            timestamp: new Date(order.created_at),
            orderId: order.id
          });
          
          // If order has an agent, add assigned notification
          if (order.agent_id) {
            notifications.push({
              id: `${order.id}-assigned`,
              title: 'Agent Assigned',
              message: `An agent has been assigned to your order #${order.id.substring(0, 8)}`,
              type: 'system',
              isRead: index > 0, // First one is unread
              timestamp: new Date(new Date(order.created_at).getTime() + 1000 * 60 * 5), // 5 mins after creation
              orderId: order.id
            });
          }
          
          // If order is in transit
          if (order.status === 'In Transit') {
            notifications.push({
              id: `${order.id}-transit`,
              title: 'Order On The Way',
              message: `Your order #${order.id.substring(0, 8)} is on the way to your location`,
              type: 'order_confirmed',
              isRead: index > 0,
              timestamp: new Date(new Date(order.created_at).getTime() + 1000 * 60 * 15), // 15 mins after creation
              orderId: order.id
            });
          }
          
          // If order is delivered
          if (order.status === 'Delivered') {
            notifications.push({
              id: `${order.id}-delivered`,
              title: 'Order Delivered',
              message: `Your order #${order.id.substring(0, 8)} has been delivered successfully`,
              type: 'order_delivered',
              isRead: index > 0,
              timestamp: new Date(new Date(order.created_at).getTime() + 1000 * 60 * 30), // 30 mins after creation
              orderId: order.id
            });
          }
          
          return notifications;
        });
        
        // Sort by timestamp
        generatedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setNotifications(generatedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription for new orders
    const channel = supabase
      .channel('orders-notifications')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
        }, 
        () => {
          console.log('Order data changed, refreshing notifications...');
          fetchNotifications();
          
          // Vibration feedback for new notification
          if (navigator.vibrate) {
            navigator.vibrate([50, 100, 50]);
          }
        }
      )
      .subscribe();
    
    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_placed':
        return <Package className="text-blue-500" />;
      case 'order_confirmed':
        return <Truck className="text-purple-500" />;
      case 'order_delivered':
        return <Check className="text-green-500" />;
      default:
        return <Bell className="text-blue-500" />;
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    if (notification.orderId) {
      navigate(`/order/${notification.orderId}`);
    }
    
    // Mark notification as read
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="Notifications" />
      
      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-blue-600"
            onClick={() => navigate('/notification-preferences')}
          >
            <Settings size={16} />
            <span>Preferences</span>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p className="ml-2 text-sm text-muted-foreground">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10">
            <Bell size={48} className="mx-auto text-blue-400 mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/place-order')}
              className="mt-2 text-blue-600"
            >
              Place an order to get started
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <Card 
                key={notification.id}
                className={cn(
                  "p-4 cursor-pointer transition-colors hover:bg-blue-50 border-blue-100",
                  !notification.isRead && "border-l-4 border-l-blue-500 shadow-md shadow-blue-100"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn(
                        "font-medium",
                        !notification.isRead && "font-semibold text-blue-700"
                      )}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;
