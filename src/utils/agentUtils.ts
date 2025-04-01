
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
      .select('id, full_name, phone_number, profile_picture, location, agent_code, online_status')
      .order('online_status', { ascending: false });
    
    if (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No agents found in database");
      return [];
    }
    
    return data.map((agent: any) => ({
      id: agent.id,
      full_name: agent.full_name,
      phone_number: agent.phone_number,
      online_status: agent.online_status || false,
      location: agent.location || "Unknown location",
      rating: 4.8, // Default rating for now
      profile_picture: agent.profile_picture || "",
      agent_code: agent.agent_code,
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
      .select('id, full_name, phone_number, profile_picture, location, agent_code, online_status')
      .eq('online_status', true);
    
    if (error) {
      console.error("Error fetching online agents:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No online agents found");
      return [];
    }
    
    return data.map((agent: any) => ({
      id: agent.id,
      full_name: agent.full_name,
      phone_number: agent.phone_number,
      online_status: true,
      location: agent.location || "Unknown location",
      rating: 4.8, // Default rating for now
      profile_picture: agent.profile_picture || "",
      agent_code: agent.agent_code,
    }));
  } catch (error) {
    console.error("Error in fetchOnlineAgents:", error);
    // Return empty array on error
    return [];
  }
};

/**
 * Sets up a real-time subscription to agent status changes
 * @param callback Function to call when agent data changes
 * @returns Cleanup function to remove the subscription
 */
export const subscribeToAgentStatusChanges = (callback: () => void) => {
  const channel = supabase
    .channel('public:agents')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'agents',
      }, 
      () => {
        console.log('Agent data changed in database');
        callback();
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};
