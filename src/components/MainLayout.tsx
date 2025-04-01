
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Home,
  Menu,
  Package,
  User,
  LogOut,
  Bell,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { vibrate } from "@/utils/vibrationUtils";
import { useNotifications } from "@/utils/notificationUtils";

interface MainLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  title?: string; // Add title prop
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showBackButton = false,
  hideHeader = false,
  hideFooter = false,
  title,
}) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { hasNewNotifications } = useNotifications();
  const { theme, setTheme } = useTheme();

  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    logout();
    setOpen(false);
    vibrate([100, 50, 100]); // Vibration feedback on logout
  };

  const handleBack = () => {
    navigate(-1);
    vibrate(50); // Short vibration feedback
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
    vibrate(50); // Short vibration feedback
  };
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    vibrate(50); // Short vibration for theme toggle
    
    toast({
      title: `${theme === "dark" ? "Light" : "Dark"} mode activated`,
      description: `Switched to ${theme === "dark" ? "light" : "dark"} mode for better visibility`,
    });
  };

  useEffect(() => {
    // Close sheet when location changes
    setOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header />}

      <main className="flex-1 px-4 py-6 md:px-6">
        <div className="max-w-7xl mx-auto">
          {title && (
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
          )}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBack}
                  aria-label="Back"
                  className="bg-white dark:bg-gray-800"
                >
                  <ArrowLeft size={18} />
                </Button>
              )}
              
              {!isDashboard && !showBackButton && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleNavigation("/dashboard")}
                  aria-label="Home"
                  className="bg-white dark:bg-gray-800"
                >
                  <Home size={18} />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="bg-white dark:bg-gray-800"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleNavigation("/notifications")}
                aria-label="Notifications"
                className={`${hasNewNotifications ? 'notification-badge' : ''} bg-white dark:bg-gray-800`}
              >
                <Bell size={18} />
              </Button>
              
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Menu"
                    className="bg-white dark:bg-gray-800"
                  >
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigate through DoorRush services
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 flex flex-col gap-4">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/dashboard")}
                    >
                      <Home className="mr-2 h-5 w-5" />
                      <span>Dashboard</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/place-order")}
                    >
                      <Package className="mr-2 h-5 w-5" />
                      <span>Place Order</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/order-history")}
                    >
                      <Package className="mr-2 h-5 w-5" />
                      <span>Order History</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/profile")}
                    >
                      <User className="mr-2 h-5 w-5" />
                      <span>Profile</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/notifications")}
                    >
                      <Bell className="mr-2 h-5 w-5" />
                      <span>Notifications</span>
                      {hasNewNotifications && (
                        <span className="ml-auto flex h-2 w-2 rounded-full bg-doorrush-secondary"></span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/notification-preferences")}
                    >
                      <Bell className="mr-2 h-5 w-5" />
                      <span>Notification Settings</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {children}
        </div>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
