
import { supabase } from "@/integrations/supabase/client";
import { RegisterData } from "@/types/auth";
import { getCustomerById, createCustomerProfile, uploadProfilePicture, updateCustomerProfilePicture } from "./customerService";

export const signInWithPassword = async (phone: string, password: string) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: `${phone}@doorrush.com`, // Using phone as email for Supabase auth
    password: password,
  });
  
  if (authError) {
    console.error("Supabase auth error:", authError);
    throw authError;
  }
  
  if (!authData.user) {
    throw new Error("No user returned from auth");
  }
  
  const customer = await getCustomerById(authData.user.id);
  if (!customer) {
    throw new Error("Error retrieving customer profile");
  }
  
  return { user: authData.user, customer };
};

export const legacyLogin = async (phone: string, password: string) => {
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

  return { customer: customerData };
};

export const registerUser = async (userData: RegisterData) => {
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
  
  // Check if the customer record was created by the trigger
  let customer = await getCustomerById(authData.user.id);
  
  // If not, create it manually
  if (!customer) {
    console.log("Customer record not found, creating manually");
    
    customer = await createCustomerProfile(authData.user.id, {
      full_name: userData.full_name,
      phone_number: userData.phone_number,
      address: userData.address,
      password_hash: userData.password // For backward compatibility
    });
    
    if (!customer) {
      // Attempt to clean up the auth user since customer creation failed
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error("Error registering account: Could not create customer profile");
    }
  }

  // Handle profile picture upload if provided
  if (userData.profile_picture) {
    const publicUrl = await uploadProfilePicture(authData.user.id, userData.profile_picture);
    
    if (publicUrl) {
      await updateCustomerProfilePicture(authData.user.id, publicUrl);
    }
  }
  
  return { user: authData.user, customer };
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getCurrentSession = async () => {
  return supabase.auth.getSession();
};
