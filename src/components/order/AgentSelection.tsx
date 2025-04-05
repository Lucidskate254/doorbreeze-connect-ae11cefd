
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioTower, AlertCircle, Info } from "lucide-react";
import { Agent } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AgentSelectionProps {
  autoAssign: boolean;
  onAutoAssignToggle: () => void;
  selectedAgentId: string;
  onAgentSelection: (agentId: string) => void;
  agents: Agent[];
  loading: boolean;
  error: string | null;
}

const AgentSelection: React.FC<AgentSelectionProps> = ({
  autoAssign,
  onAutoAssignToggle,
  selectedAgentId,
  onAgentSelection,
  agents,
  loading,
  error,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className={cn(
        "flex items-center mb-4",
        isMobile ? "flex-col gap-2 w-full" : ""
      )}>
        <Button
          variant={autoAssign ? "default" : "outline"} 
          className={cn(
            autoAssign ? "bg-doorrush-primary hover:bg-doorrush-dark" : "",
            isMobile && "w-full"
          )}
          onClick={onAutoAssignToggle}
        >
          <RadioTower size={16} className="mr-2" />
          Auto-assign
        </Button>
        <Button
          variant={!autoAssign ? "default" : "outline"}
          className={cn(
            !autoAssign ? "bg-doorrush-primary hover:bg-doorrush-dark ml-2" : "ml-2",
            isMobile && "w-full ml-0"
          )}
          onClick={onAutoAssignToggle}
        >
          Manual select
        </Button>
      </div>
      
      {!autoAssign && (
        <div className="space-y-2">
          <Label>Available Agents</Label>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-doorrush-primary border-t-transparent"></div>
              <p className="ml-2 text-sm text-muted-foreground">Loading agents...</p>
            </div>
          )}
          
          {error && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle size={18} className="text-red-500 mt-0.5 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 gap-3">
              {agents.length > 0 ? (
                agents.map(agent => (
                  <div
                    key={agent.id}
                    className={`border rounded-lg p-3 flex items-center cursor-pointer transition-colors ${
                      selectedAgentId === agent.id 
                        ? "border-doorrush-primary bg-doorrush-light"
                        : "hover:border-doorrush-primary"
                    }`}
                    onClick={() => onAgentSelection(agent.id)}
                  >
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
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="font-medium truncate">{agent.full_name}</p>
                      <div className={cn(
                        "flex items-center text-sm text-muted-foreground",
                        isMobile && "flex-wrap"
                      )}>
                        <span className="flex items-center">
                          <span className={`h-2 w-2 rounded-full ${agent.online_status ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
                          {agent.online_status ? 'Online' : 'Offline'}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="truncate">{agent.location}</span>
                        <span className="mx-2">•</span>
                        <span>★ {agent.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center">
                    <Info size={24} className="mb-2 text-muted-foreground" />
                    <p className="font-medium">No agents found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please try again or use auto-assign mode
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {autoAssign && (
        <div className="border rounded-lg p-4 bg-muted">
          <div className="flex items-start">
            <Info size={20} className="mr-3 text-doorrush-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Automatic Assignment</p>
              <p className="text-sm text-muted-foreground">
                We'll assign an available agent to your order. You'll be notified once an agent accepts your order.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSelection;
