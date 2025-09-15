import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Moon, 
  Sun, 
  User, 
  Settings,
  Zap,
  Play,
  Pause
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would update the theme context
    document.documentElement.classList.toggle('light');
  };

  const toggleAutonomousMode = () => {
    setIsAutonomousMode(!isAutonomousMode);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-glow"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AIREX
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Autonomous Research & Execution System
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Mode Toggle */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-card/50 rounded-xl border border-border/50">
          <div className="flex items-center gap-2">
            {isAutonomousMode ? (
              <Play className="w-4 h-4 text-success" />
            ) : (
              <Pause className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {isAutonomousMode ? 'Autonomous' : 'Interactive'}
            </span>
          </div>
          <Switch 
            checked={isAutonomousMode}
            onCheckedChange={toggleAutonomousMode}
            className="data-[state=checked]:bg-success"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <Badge 
            variant="outline" 
            className="hidden sm:flex items-center gap-2 bg-success/10 text-success border-success/30"
          >
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
            System Online
          </Badge>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg hover:bg-primary/10"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Research User</p>
                <p className="text-xs text-muted-foreground">user@airex.ai</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};