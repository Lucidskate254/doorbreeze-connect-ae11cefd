
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { simpleVibration } from '@/utils/vibrationUtils';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      title: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      href: "/order-history",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  const handleNavigation = (href: string) => {
    // Provide haptic feedback on navigation
    simpleVibration();
    navigate(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t flex items-center justify-around z-50 h-16 shadow-lg">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className={cn(
              "flex flex-col items-center justify-center h-full w-1/4 transition-colors",
              isActive 
                ? "text-doorrush-primary" 
                : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "flex flex-col items-center justify-center",
              isActive && "animate-pulse-scale"
            )}>
              <item.icon size={20} className={cn(
                isActive && "text-doorrush-primary"
              )} />
              <span className="text-xs mt-1">{item.title}</span>
              {isActive && (
                <span className="absolute bottom-0 w-1/5 h-1 bg-doorrush-primary rounded-t-md"></span>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export default Footer;
