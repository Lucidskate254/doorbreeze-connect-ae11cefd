
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

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
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
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-doorrush-primary logo-text">DoorRush</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={20} />
          </Button>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-doorrush-primary logo-text">DoorRush</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setOpen(false)}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                  
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
                
                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="p-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    <LogOut size={20} className="mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around z-10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center py-2 px-4",
              window.location.pathname === item.href
                ? "text-doorrush-primary"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MainLayout;
