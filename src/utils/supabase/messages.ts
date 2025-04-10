
import { supabase } from './client';

export const sendMessageToAgent = async (
  orderId: string,
  receiverId: string,
  message: string
) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.from('messages').insert([
    {
      sender_id: userId,
      receiver_id: receiverId,
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
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

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
