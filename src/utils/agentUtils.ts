
import { supabase } from "@/integrations/supabase/client";
import { Agent } from "@/types";

/**
 * Fetches all available agents from Supabase
 * @returns Promise with array of agents
 */
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('online_status', { ascending: false });
    
    if (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
    
    return data.map((agent: any) => ({
      id: agent.id,
      full_name: agent.full_name,
      phone_number: agent.phone_number,
      online_status: agent.online_status || false,
      current_location: agent.location,
      rating: 4.8, // Default rating for now
      profile_picture: agent.profile_picture,
    }));
  } catch (error) {
    console.error("Error in fetchAgents:", error);
    // Return empty array on error
    return [];
  }
};

/**
 * Fetches online agents only
 * @returns Promise with array of online agents
 */
export const fetchOnlineAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('online_status', true);
    
    if (error) {
      console.error("Error fetching online agents:", error);
      throw error;
    }
    
    return data.map((agent: any) => ({
      id: agent.id,
      full_name: agent.full_name,
      phone_number: agent.phone_number,
      online_status: true,
      current_location: agent.location,
      rating: 4.8, // Default rating for now
      profile_picture: agent.profile_picture,
    }));
  } catch (error) {
    console.error("Error in fetchOnlineAgents:", error);
    // Return empty array on error
    return [];
  }
};
