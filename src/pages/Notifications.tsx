import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Package, Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // Mock notifications - replace with Supabase data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Order Placed',
        message: 'Your order #1234 has been successfully placed',
        type: 'order_placed',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        orderId: '1234'
      },
      {
        id: '2',
        title: 'Order Confirmed',
        message: 'Your order #1234 has been confirmed and is being processed',
        type: 'order_confirmed',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
        orderId: '1234'
      },
      {
        id: '3',
        title: 'Agent Assigned',
        message: 'John Doe has been assigned to your order #1234',
        type: 'system',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        orderId: '1234'
      },
      {
        id: '4',
        title: 'Order On The Way',
        message: 'Your order #1234 is on the way to your location',
        type: 'order_confirmed',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
        orderId: '1234'
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_placed':
        return <Package className="text-doorrush-primary" />;
      case 'order_confirmed':
        return <Truck className="text-doorrush-secondary" />;
      case 'order_delivered':
        return <Check className="text-green-500" />;
      default:
        return <Bell className="text-doorrush-primary" />;
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
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        
        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <Card 
                key={notification.id}
                className={cn(
                  "p-4 cursor-pointer transition-colors hover:bg-accent",
                  !notification.isRead && "border-l-4 border-l-doorrush-primary"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn(
                        "font-medium",
                        !notification.isRead && "font-semibold"
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
