
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PlaceOrder from "./pages/PlaceOrder";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotificationPreferences from "./pages/NotificationPreferences";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";

// Protected Route component that uses the auth context
let ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // This will be overridden inside AppContent
  return <>{children}</>;
};

// Auth Route component (redirects to dashboard if already logged in)
let AuthRoute = ({ children }: { children: React.ReactNode }) => {
  // This will be overridden inside AppContent
  return <>{children}</>;
};

const queryClient = new QueryClient();

// Inner components that use auth context properly
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Now we can safely use auth context
  const ProtectedRouteWithAuth = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };
  
  const AuthRouteWithAuth = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<AuthRouteWithAuth>{<Login />}</AuthRouteWithAuth>} />
      <Route path="/register" element={<AuthRouteWithAuth>{<Register />}</AuthRouteWithAuth>} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRouteWithAuth>{<Dashboard />}</ProtectedRouteWithAuth>} />
      <Route path="/place-order" element={<ProtectedRouteWithAuth>{<PlaceOrder />}</ProtectedRouteWithAuth>} />
      <Route path="/order-confirmation" element={<ProtectedRouteWithAuth>{<OrderConfirmation />}</ProtectedRouteWithAuth>} />
      <Route path="/order-history" element={<ProtectedRouteWithAuth>{<OrderHistory />}</ProtectedRouteWithAuth>} />
      <Route path="/order/:id" element={<ProtectedRouteWithAuth>{<OrderDetail />}</ProtectedRouteWithAuth>} />
      <Route path="/profile" element={<ProtectedRouteWithAuth>{<Profile />}</ProtectedRouteWithAuth>} />
      <Route path="/notifications" element={<ProtectedRouteWithAuth>{<Notifications />}</ProtectedRouteWithAuth>} />
      <Route path="/notification-preferences" element={<ProtectedRouteWithAuth>{<NotificationPreferences />}</ProtectedRouteWithAuth>} />
      <Route path="/change-password" element={<ProtectedRouteWithAuth>{<ChangePassword />}</ProtectedRouteWithAuth>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component with proper provider nesting
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
