
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { simpleVibration } from '@/utils/vibrationUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  theme?: string;
  setTheme?: (theme: string) => void;
}

const Header = ({ showBackButton = true, title, theme, setTheme }: HeaderProps) => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch actual notification count from Supabase or notifications page data
    const fetchNotificationCount = async () => {
      try {
        // For this example, we'll get the count from the orders table as notifications
        // In a real app, you would have a dedicated notifications table
        const { data, error } = await supabase
          .from('orders')
          .select('id')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Set notification count based on unread items
        // For demo, we'll count all recent orders as notifications
        setNotificationCount(data?.length || 0);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };
    
    fetchNotificationCount();
    
    // Set up real-time listener for new orders/notifications
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders',
        }, 
        () => {
          // Increment notification count when new order is added
          setNotificationCount(prev => prev + 1);
          setHasNewNotification(true);
          
          // Reset animation after 3 seconds
          setTimeout(() => {
            setHasNewNotification(false);
          }, 3000);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleBackClick = () => {
    simpleVibration();
    navigate(-1);
  };
  
  const handleNotificationClick = () => {
    simpleVibration();
    navigate('/notifications');
    setHasNewNotification(false);
  };
  
  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === "dark" ? "light" : "dark");
      simpleVibration(50); // Short vibration for theme toggle
      
      toast({
        title: `${theme === "dark" ? "Light" : "Dark"} mode activated`,
        description: `Switched to ${theme === "dark" ? "light" : "dark"} mode for better visibility`,
      });
    }
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        {title ? (
          <h1 className="text-lg font-semibold">{title}</h1>
        ) : (
          <span className="text-xl font-bold text-doorrush-primary logo-text flex items-center">
            <img 
              src="/lovable-uploads/85078e4d-5626-44e9-8031-b6b48ae03fc9.png" 
              alt="DoorRush 254 Logo" 
              className="h-8 mr-2" 
            />
            DoorRush 254
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Dark mode toggle button */}
        {setTheme && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNotificationClick}
          className={cn(
            "relative",
            hasNewNotification && "animate-pulse"
          )}
        >
          <Bell size={20} className={cn(
            hasNewNotification && "text-doorrush-primary"
          )} />
          {notificationCount > 0 && (
            <Badge 
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs",
                hasNewNotification 
                  ? "bg-doorrush-primary animate-bounce" 
                  : "bg-doorrush-secondary"
              )}
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            simpleVibration();
            navigate('/profile');
          }}
        >
          <User size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
