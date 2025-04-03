
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { vibrate } from "@/utils/vibrationUtils";

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

  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem("doorrush_customer");
      if (storedUser) {
        setCustomer(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('phone_number', phone)
        .single();

      if (customerError || !customerData) {
        throw new Error("User not found or invalid credentials");
      }
      
      if (customerData.password_hash !== password) {
        throw new Error("Invalid password");
      }

      localStorage.setItem("doorrush_customer", JSON.stringify(customerData));
      setCustomer(customerData);
      
      vibrate([100, 50, 100]);
      
      toast({
        title: "Login successful",
        description: "Welcome back to DoorRush",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      vibrate(500);
      
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
      // Check if phone number already exists
      const { data: existingUser } = await supabase
        .from('customers')
        .select('id')
        .eq('phone_number', userData.phone_number)
        .single();

      if (existingUser) {
        throw new Error("Phone number already registered");
      }

      // Generate a unique customer ID
      const customerId = crypto.randomUUID();
      
      // Insert the new customer record
      const { data, error } = await supabase
        .from('customers')
        .insert({
          id: customerId,
          full_name: userData.full_name,
          phone_number: userData.phone_number,
          address: userData.address,
          password_hash: userData.password,
          profile_picture: ""
        })
        .select()
        .single();

      if (error) {
        console.error("Registration database error:", error);
        throw new Error("Error registering account");
      }

      console.log("Customer registered successfully:", data);

      // Handle profile picture upload if provided
      if (userData.profile_picture) {
        const fileExt = userData.profile_picture.name.split('.').pop();
        const fileName = `${customerId}.${fileExt}`;
        
        console.log("Would upload profile picture:", fileName);
        // Profile picture upload would go here in a real implementation
      }

      // Set user session
      localStorage.setItem("doorrush_customer", JSON.stringify(data));
      setCustomer(data);
      
      vibrate([100, 50, 100]);
      
      toast({
        title: "Registration successful",
        description: "Welcome to DoorRush",
      });
      
      // Redirect to dashboard after successful registration
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      
      vibrate(500);
      
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was a problem registering your account",
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
    
    vibrate([50, 30, 50]);
    
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
