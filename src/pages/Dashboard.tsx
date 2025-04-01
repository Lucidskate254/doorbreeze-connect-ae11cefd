
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, LocateFixed, ArrowRight, Clock, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOnlineAgents } from "@/utils/agentUtils";
import { Agent } from "@/types";
import { vibrate } from "@/utils/vibrationUtils";

const Dashboard = () => {
  const { customer } = useAuth();
  const [activeAgentsCount, setActiveAgentsCount] = useState<number>(0);
  const [recentlyActive, setRecentlyActive] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAgentData = async () => {
      try {
        setIsLoading(true);
        const onlineAgents = await fetchOnlineAgents();
        setActiveAgentsCount(onlineAgents.length);
        
        // Get 3 most recently online agents
        setRecentlyActive(onlineAgents.slice(0, 3));
      } catch (error) {
        console.error("Error loading agent data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentData();
    
    // Set up polling to refresh agent data every 30 seconds
    const intervalId = setInterval(loadAgentData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handlePlaceOrderClick = () => {
    vibrate([50, 30, 50]); // Subtle feedback on click
  };

  const getRandomGreetingEmoji = () => {
    const greetingEmojis = ["👋", "🙌", "✨", "😊", "🌟", "👍", "🤝"];
    return greetingEmojis[Math.floor(Math.random() * greetingEmojis.length)];
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">
          Hello, {customer?.full_name || "Customer"} {getRandomGreetingEmoji()}
        </h1>
        
        <Card className="mb-6 bg-gradient-to-r from-doorrush-primary/90 to-blue-400 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-semibold">Place a new order</h2>
                <p className="text-blue-50 mt-1">Get deliveries anywhere in Eldoret</p>
              </div>
              <Link to="/place-order" onClick={handlePlaceOrderClick}>
                <Button variant="secondary" className="animate-pulse-scale bg-white text-doorrush-primary hover:bg-blue-50">
                  Order Now
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-white to-blue-50 shadow-md border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center text-doorrush-primary mb-3">
                <LocateFixed size={20} className="mr-2" />
                <h3 className="font-semibold">Active Agents</h3>
              </div>
              {isLoading ? (
                <div className="flex items-center text-muted-foreground">
                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-doorrush-primary border-t-transparent animate-spin"></div>
                  Loading agents...
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold mb-2">{activeAgentsCount}</p>
                  <p className="text-muted-foreground text-sm">Agents currently online and ready to deliver</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-blue-50 shadow-md border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center text-doorrush-primary mb-3">
                <Clock size={20} className="mr-2" />
                <h3 className="font-semibold">Average Delivery Time</h3>
              </div>
              <p className="text-3xl font-bold mb-2">30 mins</p>
              <p className="text-muted-foreground text-sm">Average time for deliveries within Eldoret</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="featured" className="mb-6">
          <TabsList className="w-full border-b">
            <TabsTrigger value="featured" className="flex-1">Featured Services</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recently Active</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow hover:border-blue-200">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-doorrush-light rounded-full flex items-center justify-center mb-3">
                    <Package className="text-doorrush-primary" size={24} />
                  </div>
                  <h3 className="font-semibold mb-1">Package Delivery</h3>
                  <p className="text-muted-foreground text-sm">Send packages across Eldoret</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow hover:border-blue-200">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-doorrush-light rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-doorrush-primary">
                      <path d="m21 10-9 4-9-4 9-4 9 4" />
                      <path d="m3 10 9 4 9-4" />
                      <path d="M12 14v4" />
                      <path d="M7 14.5v2" />
                      <path d="M17 14.5v2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Shopping Pickup</h3>
                  <p className="text-muted-foreground text-sm">We'll shop and deliver to you</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow hover:border-blue-200">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-doorrush-light rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-doorrush-primary">
                      <rect width="16" height="20" x="4" y="2" rx="2" />
                      <line x1="12" x2="12" y1="18" y2="18" />
                      <line x1="8" x2="8" y1="6" y2="6" />
                      <line x1="16" x2="16" y1="6" y2="6" />
                      <line x1="8" x2="8" y1="10" y2="10" />
                      <line x1="16" x2="16" y1="10" y2="10" />
                      <line x1="8" x2="8" y1="14" y2="14" />
                      <line x1="16" x2="16" y1="14" y2="14" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Bill Payments</h3>
                  <p className="text-muted-foreground text-sm">Pay bills without leaving home</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-doorrush-primary border-t-transparent"></div>
              </div>
            ) : recentlyActive.length > 0 ? (
              <div className="space-y-3">
                {recentlyActive.map(agent => (
                  <Card key={agent.id} className="bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center">
                      <div className="h-10 w-10 bg-muted rounded-full overflow-hidden flex-shrink-0">
                        {agent.profile_picture ? (
                          <img
                            src={agent.profile_picture}
                            alt={agent.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-doorrush-primary text-white">
                            {agent.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium">{agent.full_name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                            Online
                          </span>
                          <span className="mx-2">•</span>
                          <span>{agent.location}</span>
                        </div>
                      </div>
                      <a href={`tel:${agent.phone_number}`} className="ml-2 p-2 text-muted-foreground hover:text-foreground">
                        <Phone size={16} />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No agents are currently online</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
