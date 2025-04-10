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
import NotFound from "./pages/ChatWithAgent";
import FeedbackPage from "./pages/FeedbackPage";

const queryClient = new QueryClient();

// Inner components that use auth context properly
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Now we can safely use auth context
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };
  
  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
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
      <Route path="/login" element={<AuthRoute>{<Login />}</AuthRoute>} />
      <Route path="/register" element={<AuthRoute>{<Register />}</AuthRoute>} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute>{<Dashboard />}</ProtectedRoute>} />
      <Route path="/place-order" element={<ProtectedRoute>{<PlaceOrder />}</ProtectedRoute>} />
      <Route path="/order-confirmation" element={<ProtectedRoute>{<OrderConfirmation />}</ProtectedRoute>} />
      <Route path="/order-history" element={<ProtectedRoute>{<OrderHistory />}</ProtectedRoute>} />
      <Route path="/order/:id" element={<ProtectedRoute>{<OrderDetail />}</ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute>{<Profile />}</ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute>{<Notifications />}</ProtectedRoute>} />
      <Route path="/notification-preferences" element={<ProtectedRoute>{<NotificationPreferences />}</ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute>{<ChangePassword />}</ProtectedRoute>} />
      <Route path="/feedback" element={<FeedbackPage />} />
      
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
