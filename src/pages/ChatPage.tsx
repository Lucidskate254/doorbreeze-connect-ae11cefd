
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getOrderMessages, sendMessageToAgent } from '@/utils/supabase/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import MainLayout from '@/components/MainLayout';

export default function ChatPage() {
  const { orderId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch agent_id from order and set it
    const fetchAgentId = async () => {
      if (!orderId) return;
      
      try {
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
          console.log("Agent ID found:", data.agent_id);
          setAgentId(data.agent_id);
        } else {
          console.log("No agent assigned to this order");
          toast({
            title: 'No agent assigned',
            description: 'This order doesn\'t have an agent assigned yet',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Exception fetching agent ID:', err);
        toast({
          title: 'Error',
          description: 'Failed to load agent information',
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

  const getUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  };

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getUserId().then(id => {
      setCurrentUserId(id || null);
    });
  }, []);

  return (
    <MainLayout title="Chat with Agent" showBackButton={true}>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/dashboard')}>
              <Home className="h-4 w-4 mr-1 inline" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/order-history')}>
              Orders
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/order/${orderId}`)}>
              Order Details
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Chat</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chat with Agent</h2>
        </div>
        
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto p-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender_id === currentUserId
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
            <div ref={messagesEndRef} />
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
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
            disabled={loading || !input.trim() || !agentId}
          >
            <ArrowRight className="h-4 w-4 mr-2" /> Send
          </Button>
        </div>

        {!agentId && (
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
            No agent has been assigned to this order yet. You will be able to chat once an agent is assigned.
          </div>
        )}
      </div>
    </MainLayout>
  );
}
