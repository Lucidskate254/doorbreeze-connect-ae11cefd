import { useEffect, useState } from 'react';
import { getOrderMessages, sendMessageToAgent } from '@/utils/supabase/messages';
import { useParams } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';

export default function ChatPage() {
  const { orderId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [agentId, setAgentId] = useState('');

  useEffect(() => {
    // Fetch agent_id from order and set it
    const fetchAgentId = async () => {
      const { data } = await supabase.from('orders').select('agent_id').eq('id', orderId).single();
      if (data) setAgentId(data.agent_id);
    };

    fetchAgentId();
    loadMessages();
  }, [orderId]);

  const loadMessages = async () => {
    const msgs = await getOrderMessages(orderId);
    setMessages(msgs);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessageToAgent(orderId, agentId, input);
    setInput('');
    loadMessages();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat with Agent</h2>
      <div className="mb-4 space-y-2 max-h-[400px] overflow-y-scroll">
        {messages.map(msg => (
          <div key={msg.id} className="bg-gray-100 p-2 rounded">
            {msg.message_text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
} 