
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { vibrate } from "@/utils/vibrationUtils";
import { AuthContextType, Customer, RegisterData } from "@/types/auth";
import { signInWithPassword, legacyLogin, registerUser, signOut, getCurrentSession } from "@/services/authService";
import { getCustomerById } from "@/services/customerService";

export const AuthContext = createContext<AuthContextType | null>(null);

// Maximum timeout for session check (in milliseconds)
const SESSION_CHECK_TIMEOUT = 10000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Set up timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          console.error("Session check timeout exceeded");
          setIsLoading(false);
          setAuthError("Session check timed out. Please refresh the page or try again later.");
        }, SESSION_CHECK_TIMEOUT);

        // First check for Supabase session
        const { data: { session }, error: sessionError } = await getCurrentSession();
        
        // Clear timeout since we got a response
        clearTimeout(timeoutId);
        
        if (sessionError) {
          console.error("Supabase session error:", sessionError);
          setAuthError("Error checking authentication status.");
          throw sessionError;
        }
        
        if (session) {
          console.log("Found Supabase session, user is authenticated:", session.user);
          
          try {
            // Get customer data from the customers table
            const customerData = await getCustomerById(session.user.id);
              
            if (customerData) {
              console.log("Found customer data:", customerData);
              setCustomer(customerData);
            }
          } catch (error) {
            console.error("Error fetching customer data:", error);
            // Don't block auth process if customer data fetch fails
          }
        } else {
          // Fallback to localStorage for backward compatibility
          const storedUser = localStorage.getItem("doorrush_customer");
          if (storedUser) {
            console.log("No Supabase session, but found stored user in localStorage");
            setCustomer(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        // Clear any potentially invalid session data
        localStorage.removeItem("doorrush_customer");
      } finally {
        // Ensure loading state is turned off regardless of outcome
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change event:", event, session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Use setTimeout to avoid potential deadlocks with Supabase client
            setTimeout(async () => {
              try {
                const customerData = await getCustomerById(session.user.id);
                if (customerData) {
                  setCustomer(customerData);
                  setIsLoading(false);
                }
              } catch (error) {
                console.error("Error fetching customer data on auth change:", error);
                setIsLoading(false);
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setCustomer(null);
          localStorage.removeItem("doorrush_customer");
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log("Attempting to login with phone:", phone);
      
      try {
        // First try Supabase authentication
        const { customer: customerData } = await signInWithPassword(phone, password);
        
        localStorage.setItem("doorrush_customer", JSON.stringify(customerData));
        setCustomer(customerData);
      } catch (authError) {
        console.error("Supabase auth error:", authError);
        
        // Fallback to legacy authentication
        console.log("Falling back to legacy authentication");
        const { customer: customerData } = await legacyLogin(phone, password);

        localStorage.setItem("doorrush_customer", JSON.stringify(customerData));
        setCustomer(customerData);
      }
      
      vibrate([100, 50, 100]);
      
      toast({
        title: "Login successful",
        description: "Welcome back to DoorRush",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      vibrate(500);
      
      const errorMessage = error instanceof Error ? error.message : "Invalid phone number or password";
      setAuthError(errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    console.log("Starting registration process with data:", { 
      ...userData, 
      password: "****" // Hide password in logs
    });
    
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { customer: customerData } = await registerUser(userData);
      
      if (customerData) {
        setCustomer(customerData);
      }
      
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
      
      const errorMessage = error instanceof Error ? error.message : "There was a problem registering your account";
      setAuthError(errorMessage);
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Sign out from Supabase auth
    signOut().then(() => {
      localStorage.removeItem("doorrush_customer");
      setCustomer(null);
      navigate("/login");
      
      vibrate([50, 30, 50]);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }).catch(error => {
      console.error("Error during logout:", error);
      
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        authError,
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
