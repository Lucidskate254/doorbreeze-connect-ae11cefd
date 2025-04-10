
import { supabase } from '@/integrations/supabase/client';

export const sendMessageToAgent = async (
  orderId: string,
  receiverId: string,
  message: string
) => {
  // Get the current authenticated user
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Insert the message with the customer (current user) as sender and agent as receiver
  const { data, error } = await supabase.from('messages').insert([
    {
      sender_id: userId, // The customer/user sending the message
      receiver_id: receiverId, // The agent receiving the message
      order_id: orderId,
      message_text: message,
    },
  ]);

  if (error) {
    console.error('Error sending message:', error.message);
    throw error;
  }

  return data;
};

export const getOrderMessages = async (orderId: string) => {
  // Get the current authenticated user
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Get all messages for the order involving the current user
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('order_id', orderId)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error.message);
    throw error;
  }

  return data;
}; 
