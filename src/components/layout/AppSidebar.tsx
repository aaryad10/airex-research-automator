import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Upload, 
  MessageSquare, 
  History, 
  Network, 
  Settings,
  ChevronDown,
  Brain,
  Code,
  BarChart3,
  RefreshCw,
  Rocket,
  Database,
  Circle
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// Navigation items
const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Upload Papers", url: "/upload", icon: Upload },
  { title: "Chat Interface", url: "/chat", icon: MessageSquare },
  { title: "Experiments", url: "/experiments", icon: History },
  { title: "Knowledge Graph", url: "/knowledge-graph", icon: Network },
  { title: "Settings", url: "/settings", icon: Settings },
];

// Agent status data
const agents = [
  { 
    name: "Ingestion Agent", 
    icon: Database, 
    status: "idle", 
    description: "Processes research papers"
  },
  { 
    name: "Idea Generation", 
    icon: Brain, 
    status: "running", 
    description: "Generates research ideas"
  },
  { 
    name: "Code Implementation", 
    icon: Code, 
    status: "complete", 
    description: "Implements algorithms"
  },
  { 
    name: "Benchmark Agent", 
    icon: BarChart3, 
    status: "idle", 
    description: "Runs performance tests"
  },
  { 
    name: "Refactoring Agent", 
    icon: RefreshCw, 
    status: "idle", 
    description: "Optimizes code"
  },
  { 
    name: "CI/CD Agent", 
    icon: Rocket, 
    status: "idle", 
    description: "Handles deployment"
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'agent-running';
    case 'complete': return 'agent-complete';
    case 'error': return 'agent-error';
    default: return 'agent-idle';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'running': return 'default';
    case 'complete': return 'secondary';
    case 'error': return 'destructive';
    default: return 'outline';
  }
};

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [agentsExpanded, setAgentsExpanded] = useState(true);
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    return isActive(path) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium hover:bg-primary/15" 
      : "text-muted-foreground hover:text-foreground hover:bg-accent/50";
  };

  return (
    <Sidebar className="border-r border-border/40 bg-sidebar/95 backdrop-blur-sm">
      <SidebarContent className="gap-0">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${getNavClasses(item.url)}`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Agent Status */}
        <SidebarGroup>
          <Collapsible open={agentsExpanded} onOpenChange={setAgentsExpanded}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-xs uppercase tracking-wider text-muted-foreground px-3 py-2 hover:text-foreground transition-colors">
                <span>Active Agents</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${agentsExpanded ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <div className="space-y-2 px-2">
                  {agents.map((agent) => (
                    <div key={agent.name} className="agent-card group">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <agent.icon className="w-4 h-4 text-muted-foreground" />
                          <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-${getStatusColor(agent.status)} ${agent.status === 'running' ? 'animate-pulse-glow' : ''}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{agent.name}</span>
                            <Badge 
                              variant={getStatusBadgeVariant(agent.status)}
                              className="text-xs capitalize"
                            >
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      {/* Mode Toggle Footer */}
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Autonomous Mode</span>
            <Switch 
              checked={isAutonomousMode}
              onCheckedChange={setIsAutonomousMode}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {isAutonomousMode 
              ? "System runs independently without user input"
              : "User provides high-level tasks via chat interface"
            }
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}