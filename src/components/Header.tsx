
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header = ({ showBackButton = true, title }: HeaderProps) => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
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
          onClick={() => navigate('/notifications')}
          className="relative"
        >
          <Bell size={20} />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-doorrush-secondary">
            2
          </Badge>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
        >
          <User size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
