
import { useState, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Clock,
  LogOut,
  Menu,
  User,
  X,
  ShoppingBag,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  title?: string;
  showBackButton?: boolean;
}

const MainLayout = ({ 
  children, 
  showHeader = true,
  showFooter = true,
  title,
  showBackButton = true
}: MainLayoutProps) => {
  const { customer, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      title: "Place Order",
      icon: <ShoppingBag size={20} />,
      href: "/place-order",
    },
    {
      title: "Order History",
      icon: <Clock size={20} />,
      href: "/order-history",
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      href: "/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      {showHeader && <Header title={title} showBackButton={showBackButton} />}
      
      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr]">
        <aside className="bg-white border-r h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-doorrush-primary logo-text">DoorRush</span>
            </Link>
          </div>
          
          <div className="px-6 py-4 border-t border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage 
                  src={customer?.profile_picture} 
                  alt={customer?.full_name} 
                />
                <AvatarFallback>
                  {customer?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{customer?.full_name}</p>
                <p className="text-sm text-muted-foreground">{customer?.phone_number}</p>
              </div>
            </div>
          </div>
          
          <nav className="p-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-6 mt-auto border-t absolute bottom-0 w-full">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={logout}
            >
              <LogOut size={20} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </aside>
        
        <main className="p-6 overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
      
      {/* Mobile content */}
      <main className="lg:hidden p-4 pb-20">
        {children}
      </main>
      
      {/* Mobile navigation */}
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
