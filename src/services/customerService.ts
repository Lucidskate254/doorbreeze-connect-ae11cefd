
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/auth";

export const getCustomerById = async (userId: string): Promise<Customer | null> => {
  try {
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (customerError) {
      console.error("Error fetching customer data:", customerError);
      return null;
    }
    
    return customerData;
  } catch (error) {
    console.error("Unexpected error in getCustomerById:", error);
    return null;
  }
};

export const createCustomerProfile = async (customerId: string, data: { 
  full_name: string, 
  phone_number: string, 
  address: string, 
  password_hash?: string 
}): Promise<Customer | null> => {
  try {
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        id: customerId,
        full_name: data.full_name,
        phone_number: data.phone_number,
        address: data.address,
        password_hash: data.password_hash
      })
      .select()
      .single();

    if (customerError) {
      console.error("Error creating customer record:", customerError);
      return null;
    }
    
    return customerData;
  } catch (error) {
    console.error("Unexpected error in createCustomerProfile:", error);
    return null;
  }
};

export const updateCustomerProfilePicture = async (customerId: string, publicUrl: string): Promise<boolean> => {
  try {
    const { error: updateError } = await supabase
      .from('customers')
      .update({ profile_picture: publicUrl })
      .eq('id', customerId);
      
    if (updateError) {
      console.error("Error updating profile picture URL:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error in updateCustomerProfilePicture:", error);
    return false;
  }
};

export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file);
      
    if (uploadError) {
      console.error("Profile picture upload error:", uploadError);
      return null;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);
    
    if (!publicUrlData) {
      console.error("Error getting public URL for profile picture");
      return null;
    }
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error handling profile picture:", error);
    return null;
  }
};
