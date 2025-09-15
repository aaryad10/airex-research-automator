import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon,
  Key,
  Bell,
  Palette,
  Database,
  Zap,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const Settings = () => {
  // API Keys state
  const [apiKeys, setApiKeys] = useState({
    arxiv: "",
    openai: "",
    huggingface: "",
    wandb: ""
  });
  const [showApiKeys, setShowApiKeys] = useState({
    arxiv: false,
    openai: false, 
    huggingface: false,
    wandb: false
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    experimentComplete: true,
    newPapers: false,
    systemErrors: true,
    weeklyReports: true,
    agentUpdates: false
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    autonomousMode: false,
    maxConcurrentExperiments: 3,
    defaultTimeout: 3600,
    enableGPU: true,
    logLevel: "info",
    theme: "dark"
  });

  const handleApiKeyChange = (key: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Mock save operation
    toast.success("Settings saved successfully!");
  };

  const exportSettings = () => {
    const settings = {
      notifications,
      systemSettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airex-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Settings exported!");
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setNotifications({
        experimentComplete: true,
        newPapers: false,
        systemErrors: true,
        weeklyReports: true,
        agentUpdates: false
      });
      setSystemSettings({
        autonomousMode: false,
        maxConcurrentExperiments: 3,
        defaultTimeout: 3600,
        enableGPU: true,
        logLevel: "info",
        theme: "dark"
      });
      toast.success("Settings reset to defaults!");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure AIREX system preferences and integrations
        </p>
      </motion.div>

      {/* API Keys Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Keys & Integrations
            </CardTitle>
            <CardDescription>
              Configure external service integrations for enhanced functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(apiKeys).map(([service, key]) => (
              <div key={service} className="space-y-2">
                <Label htmlFor={service} className="capitalize font-medium">
                  {service === 'arxiv' ? 'arXiv API' : 
                   service === 'openai' ? 'OpenAI API' :
                   service === 'huggingface' ? 'Hugging Face API' :
                   'Weights & Biases API'} Key
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id={service}
                      type={showApiKeys[service as keyof typeof showApiKeys] ? "text" : "password"}
                      placeholder={`Enter your ${service} API key`}
                      value={key}
                      onChange={(e) => handleApiKeyChange(service, e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => toggleApiKeyVisibility(service)}
                    >
                      {showApiKeys[service as keyof typeof showApiKeys] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <Badge variant={key ? "default" : "outline"}>
                    {key ? "Configured" : "Not Set"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {key === 'experimentComplete' && "Get notified when experiments finish"}
                    {key === 'newPapers' && "Receive alerts for newly ingested papers"}
                    {key === 'systemErrors' && "Be alerted about system errors and failures"}
                    {key === 'weeklyReports' && "Get weekly summary reports"}
                    {key === 'agentUpdates' && "Receive updates about agent activities"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* System Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              System Configuration
            </CardTitle>
            <CardDescription>
              Configure system behavior and performance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Max Concurrent Experiments</Label>
                <Input
                  type="number"
                  value={systemSettings.maxConcurrentExperiments}
                  onChange={(e) => handleSystemSettingChange('maxConcurrentExperiments', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of experiments that can run simultaneously
                </p>
              </div>

              <div className="space-y-2">
                <Label>Default Timeout (seconds)</Label>
                <Input
                  type="number"
                  value={systemSettings.defaultTimeout}
                  onChange={(e) => handleSystemSettingChange('defaultTimeout', parseInt(e.target.value))}
                  min="300"
                  max="86400"
                />
                <p className="text-xs text-muted-foreground">
                  Default timeout for experiment execution
                </p>
              </div>

              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select
                  value={systemSettings.logLevel}
                  onValueChange={(value) => handleSystemSettingChange('logLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={systemSettings.theme}
                  onValueChange={(value) => handleSystemSettingChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enable GPU Acceleration</Label>
                  <p className="text-sm text-muted-foreground">
                    Use GPU for faster model training and inference
                  </p>
                </div>
                <Switch
                  checked={systemSettings.enableGPU}
                  onCheckedChange={(checked) => handleSystemSettingChange('enableGPU', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Autonomous Mode by Default</Label>
                  <p className="text-sm text-muted-foreground">
                    Start new sessions in autonomous mode
                  </p>
                </div>
                <Switch
                  checked={systemSettings.autonomousMode}
                  onCheckedChange={(checked) => handleSystemSettingChange('autonomousMode', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security & Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Manage data privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Anonymous Usage Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve AIREX by sharing anonymous usage data
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Automatic Data Cleanup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically delete experiment data after 30 days
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Secure API Communication</Label>
                <p className="text-sm text-muted-foreground">
                  Always use HTTPS for API communications
                </p>
              </div>
              <Switch defaultChecked={true} disabled />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-4"
      >
        <Button onClick={saveSettings} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        
        <Button variant="outline" onClick={exportSettings}>
          <Download className="w-4 h-4 mr-2" />
          Export Settings
        </Button>
        
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import Settings
        </Button>
        
        <Button variant="destructive" onClick={resetSettings}>
          <Trash2 className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">Online</div>
                <div className="text-sm text-muted-foreground">System Status</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">v2.1.0</div>
                <div className="text-sm text-muted-foreground">Version</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">6</div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;