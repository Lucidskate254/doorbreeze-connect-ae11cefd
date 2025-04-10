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
  MessageSquare,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { simpleVibration } from "@/utils/vibrationUtils";
import { useNotifications } from "@/utils/notificationUtils";

interface MainLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  title?: string;
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
    simpleVibration(100); // Vibration feedback on logout
  };

  const handleBack = () => {
    navigate(-1);
    simpleVibration(50); // Short vibration feedback
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
    simpleVibration(50); // Short vibration feedback
  };

  useEffect(() => {
    // Close sheet when location changes
    setOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header title={title} showBackButton={showBackButton} theme={theme} setTheme={setTheme} />}

      <main className="flex-1 px-4 py-6 md:px-6">
        <div className="max-w-7xl mx-auto">
          {title && (
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
          )}
          
          {children}
        </div>
      </main>

      {!hideFooter && <Footer />}
      
      <Sheet open={open} onOpenChange={setOpen}>
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
              onClick={() => handleNavigation("/feedback")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              <span>Feedback & Contact</span>
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
        
        {/* Move the SheetTrigger inside the Sheet component */}
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Menu"
            className="fixed bottom-6 right-6 rounded-full shadow-lg bg-white dark:bg-gray-800 z-50"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  );
};

export default MainLayout;
