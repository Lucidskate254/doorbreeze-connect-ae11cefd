
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
      try {
        // First check for Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Supabase session error:", sessionError);
          throw sessionError;
        }
        
        if (session) {
          console.log("Found Supabase session, user is authenticated:", session.user);
          
          // Get customer data from the customers table
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (customerError) {
            console.error("Error fetching customer data:", customerError);
            throw customerError;
          }
          
          if (customerData) {
            console.log("Found customer data:", customerData);
            setCustomer(customerData);
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
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event, session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            try {
              const { data: customerData, error: customerError } = await supabase
                .from('customers')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (customerError) throw customerError;
              if (customerData) setCustomer(customerData);
            } catch (error) {
              console.error("Error fetching customer data on auth change:", error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setCustomer(null);
          localStorage.removeItem("doorrush_customer");
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting to login with phone:", phone);
      
      // First try Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: `${phone}@doorrush.com`, // Using phone as email for Supabase auth
        password: password,
      });
      
      if (authError) {
        console.error("Supabase auth error:", authError);
        
        // Fallback to legacy authentication
        console.log("Falling back to legacy authentication");
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
      } else if (authData.user) {
        console.log("Supabase authentication successful:", authData.user);
        
        // Get customer profile data
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        if (customerError) {
          console.error("Error fetching customer data:", customerError);
          throw new Error("Error retrieving customer profile");
        }
        
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
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid phone number or password",
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
    try {
      // Check if phone number already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('customers')
        .select('id')
        .eq('phone_number', userData.phone_number)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing user:", checkError);
        throw new Error("Error checking registration data");
      }

      if (existingUser) {
        console.log("Phone number already registered:", userData.phone_number);
        throw new Error("Phone number already registered");
      }

      // Create the auth user first
      const email = `${userData.phone_number}@doorrush.com`; // Using phone as email for Supabase auth
      console.log("Creating auth user with email:", email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            address: userData.address
          }
        }
      });
      
      if (authError) {
        console.error("Supabase auth registration error:", authError);
        throw new Error("Error creating account: " + authError.message);
      }
      
      if (!authData.user) {
        console.error("No user returned from auth signup");
        throw new Error("Error creating account: No user returned");
      }
      
      console.log("Auth user created successfully:", authData.user.id);
      
      // Check if the customer record was created by the trigger
      // If not, create it manually
      const { data: existingCustomer, error: customerCheckError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();
        
      if (customerCheckError) {
        console.error("Error checking for customer record:", customerCheckError);
      }
      
      if (!existingCustomer) {
        console.log("Customer record not found, creating manually");
        
        // Manually create the customer record
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert({
            id: authData.user.id,
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            address: userData.address,
            password_hash: userData.password // For backward compatibility
          })
          .select()
          .single();

        if (customerError) {
          console.error("Error creating customer record:", customerError);
          
          // Attempt to clean up the auth user since customer creation failed
          await supabase.auth.admin.deleteUser(authData.user.id);
          
          throw new Error("Error registering account: " + customerError.message);
        }
        
        console.log("Customer record created manually:", customerData);
        setCustomer(customerData);
      } else {
        console.log("Customer record already exists:", existingCustomer);
        setCustomer(existingCustomer);
      }

      // Handle profile picture upload if provided
      if (userData.profile_picture) {
        const fileExt = userData.profile_picture.name.split('.').pop();
        const fileName = `${authData.user.id}.${fileExt}`;
        
        console.log("Uploading profile picture:", fileName);
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(fileName, userData.profile_picture);
            
          if (uploadError) {
            console.error("Profile picture upload error:", uploadError);
            // Continue registration even if profile picture upload fails
          } else {
            // Get the public URL for the uploaded image
            const { data: publicUrlData } = supabase.storage
              .from('profiles')
              .getPublicUrl(fileName);
              
            if (publicUrlData) {
              // Update the customer record with the profile picture URL
              const { error: updateError } = await supabase
                .from('customers')
                .update({ profile_picture: publicUrlData.publicUrl })
                .eq('id', authData.user.id);
                
              if (updateError) {
                console.error("Error updating profile picture URL:", updateError);
              }
            }
          }
        } catch (error) {
          console.error("Error handling profile picture:", error);
          // Continue registration even if profile picture handling fails
        }
      }
      
      vibrate([100, 50, 100]);
      
      toast({
        title: "Registration successful",
        description: "Welcome to DoorRush",
      });
      
      // Set the customer in state to trigger authentication
      if (existingCustomer) {
        setCustomer(existingCustomer);
      }
      
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
    // Sign out from Supabase auth
    supabase.auth.signOut().then(() => {
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
