import { supabase } from './client';

export const sendMessageToAgent = async (
  orderId: string,
  receiverId: string,
  message: string
) => {
  const { data, error } = await supabase.from('messages').insert([
    {
      sender_id: (await supabase.auth.getUser()).data.user?.id,
      receiver_id: receiverId,
      order_id: orderId,
      message_text: message,
    },
  ]);

  if (error) {
    console.error('Error sending message:', error.message);
    return null;
  }

  return data;
};

export const getOrderMessages = async (orderId: string) => {
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('order_id', orderId)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error.message);
    return [];
  }

  return data;
}; 