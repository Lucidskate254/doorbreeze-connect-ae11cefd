
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getOrderMessages, sendMessageToAgent } from '@/utils/supabase/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ChatPage() {
  const { orderId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Fetch agent_id from order and set it
    const fetchAgentId = async () => {
      if (!orderId) return;
      
      const { data, error } = await supabase
        .from('orders')
        .select('agent_id')
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching agent ID:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agent information',
          variant: 'destructive',
        });
        return;
      }
      
      if (data && data.agent_id) {
        setAgentId(data.agent_id);
      } else {
        toast({
          title: 'No agent assigned',
          description: 'This order doesn\'t have an agent assigned yet',
          variant: 'destructive',
        });
      }
    };

    fetchAgentId();
    loadMessages();
  }, [orderId]);

  useEffect(() => {
    // Set up a subscription for real-time updates of messages
    if (!orderId) return;

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          // When a new message is added, refresh the messages list
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const loadMessages = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const msgs = await getOrderMessages(orderId);
      setMessages(msgs || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !orderId || !agentId) return;
    
    setLoading(true);
    try {
      await sendMessageToAgent(orderId, agentId, input);
      setInput('');
      // No need to manually reload messages as the real-time subscription will handle it
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const userId = supabase.auth.getUser().then(data => data.data.user?.id);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
          <SheetTitle>Chat with Agent</SheetTitle>
        </SheetHeader>
        
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-16 pt-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender_id === userId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{msg.message_text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {formatTimestamp(msg.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="fixed bottom-4 left-0 right-0 px-4 sm:px-6 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading || !agentId}
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            disabled={loading || !input.trim() || !agentId}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
