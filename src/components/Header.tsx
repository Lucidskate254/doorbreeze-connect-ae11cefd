
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { simpleVibration } from '@/utils/vibrationUtils';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header = ({ showBackButton = true, title }: HeaderProps) => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [notificationCount, setNotificationCount] = useState(2);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  
  useEffect(() => {
    // Simulate new notifications - this would be replaced with real data
    const interval = setInterval(() => {
      // Random chance of new notification for demo purposes
      if (Math.random() > 0.7) {
        setNotificationCount(prev => prev + 1);
        setHasNewNotification(true);
        
        // Reset animation after 3 seconds
        setTimeout(() => {
          setHasNewNotification(false);
        }, 3000);
      }
    }, 20000);
    
    return () => clearInterval(interval);
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
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b p-4 flex items-center justify-between">
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
          <span className="text-xl font-bold text-doorrush-primary logo-text">DoorRush</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
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
