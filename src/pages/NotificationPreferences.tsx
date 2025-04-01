
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Bell, BellOff, Smartphone, Mail, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const NotificationPreferences = () => {
  const { toast } = useToast();
  const { customer } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification preferences state
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    agentAssigned: true,
    orderDelivered: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true
  });
  
  useEffect(() => {
    // Vibration feedback for page load
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Here you would fetch real notification preferences from the database
    // This is a placeholder for now
    const fetchPreferences = async () => {
      if (!customer?.id) return;
      
      try {
        setIsLoading(true);
        // In a real implementation, you would fetch from a preferences table
        console.log("Would fetch preferences for user:", customer.id);
      } catch (error) {
        console.error("Error fetching notification preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, [customer]);
  
  const handleToggleChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Provide haptic feedback on toggle
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };
  
  const savePreferences = async () => {
    if (!customer?.id) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, you would save to a preferences table
      console.log("Would save preferences for user:", customer.id, preferences);
      
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
      
      // Provide vibration feedback on success
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      
      toast({
        title: "Error Saving Preferences",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      });
      
      // Provide vibration feedback on error
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Notification Preferences">
      <div className="max-w-3xl mx-auto animate-fade-in pb-20">
        <Card className="mb-6 shadow-md border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="text-blue-500" size={20} />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-muted-foreground mb-6">
              Customize which notifications you receive and how they are delivered.
            </p>
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Notification Types</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for order status changes
                    </p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={preferences.orderUpdates}
                    onCheckedChange={() => handleToggleChange('orderUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="agentAssigned">Agent Assigned</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when an agent is assigned to your order
                    </p>
                  </div>
                  <Switch
                    id="agentAssigned"
                    checked={preferences.agentAssigned}
                    onCheckedChange={() => handleToggleChange('agentAssigned')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderDelivered">Order Delivered</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when your order is delivered
                    </p>
                  </div>
                  <Switch
                    id="orderDelivered"
                    checked={preferences.orderDelivered}
                    onCheckedChange={() => handleToggleChange('orderDelivered')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about special offers and promotions
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={preferences.promotions}
                    onCheckedChange={() => handleToggleChange('promotions')}
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium pt-4">Notification Channels</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="text-blue-500" size={20} />
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={() => handleToggleChange('pushNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="text-blue-500" size={20} />
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={() => handleToggleChange('emailNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-blue-500" size={20} />
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={preferences.smsNotifications}
                    onCheckedChange={() => handleToggleChange('smsNotifications')}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={savePreferences}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotificationPreferences;
