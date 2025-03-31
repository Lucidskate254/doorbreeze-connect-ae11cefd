
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type Customer = {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
  profile_picture?: string;
  created_at: string;
};

type AuthContextType = {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
};

type RegisterData = {
  full_name: string;
  phone_number: string;
  address: string;
  profile_picture?: File;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock authentication for now - will connect to Supabase later
  useEffect(() => {
    const storedUser = localStorage.getItem("doorrush_customer");
    if (storedUser) {
      setCustomer(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate authentication - replace with Supabase auth
      const mockCustomer = {
        id: "123",
        full_name: "Test User",
        phone_number: phone,
        address: "Eldoret CBD",
        profile_picture: "",
        created_at: new Date().toISOString(),
      };

      localStorage.setItem("doorrush_customer", JSON.stringify(mockCustomer));
      setCustomer(mockCustomer);
      
      toast({
        title: "Login successful",
        description: "Welcome back to DoorRush",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid phone number or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate registration - replace with Supabase auth
      const mockCustomer = {
        id: "123",
        full_name: userData.full_name,
        phone_number: userData.phone_number,
        address: userData.address,
        profile_picture: "",
        created_at: new Date().toISOString(),
      };

      localStorage.setItem("doorrush_customer", JSON.stringify(mockCustomer));
      setCustomer(mockCustomer);
      
      toast({
        title: "Registration successful",
        description: "Welcome to DoorRush",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was a problem registering your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("doorrush_customer");
    setCustomer(null);
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
