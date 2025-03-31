
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around z-50 h-16">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={cn(
              "flex flex-col items-center justify-center h-full w-1/4",
              isActive ? "text-doorrush-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.title}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Footer;
