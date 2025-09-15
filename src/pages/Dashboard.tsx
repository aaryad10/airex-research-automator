import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  TrendingUp, 
  FileText, 
  Brain, 
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for dashboard
const recentExperiments = [
  {
    id: "exp_001",
    title: "Few-shot Classification with BERT",
    status: "complete",
    progress: 100,
    accuracy: 94.2,
    novelty: 87,
    date: "2024-01-15",
    duration: "2h 34m"
  },
  {
    id: "exp_002", 
    title: "Neural Architecture Search for NLP",
    status: "running",
    progress: 67,
    accuracy: 89.1,
    novelty: 92,
    date: "2024-01-15",
    duration: "4h 12m"
  },
  {
    id: "exp_003",
    title: "RAG System Optimization",
    status: "pending",
    progress: 25,
    accuracy: null,
    novelty: null,
    date: "2024-01-14",
    duration: "45m"
  }
];

const stats = [
  {
    title: "Papers Ingested",
    value: "1,247",
    change: "+18%",
    trend: "up",
    icon: FileText
  },
  {
    title: "Ideas Generated",
    value: "89",
    change: "+12%", 
    trend: "up",
    icon: Brain
  },
  {
    title: "Experiments Run",
    value: "34",
    change: "+5%",
    trend: "up", 
    icon: Activity
  },
  {
    title: "Avg Accuracy",
    value: "91.3%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete': return 'bg-success text-success-foreground';
    case 'running': return 'bg-primary text-primary-foreground';
    case 'pending': return 'bg-warning text-warning-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'complete': return CheckCircle;
    case 'running': return Activity;
    case 'pending': return Clock;
    default: return AlertCircle;
  }
};

const Dashboard = () => {
  const [showNewExperimentModal, setShowNewExperimentModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Research Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor autonomous research progress and system performance
          </p>
        </div>
        
        <Button 
          onClick={() => setShowNewExperimentModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Start New Experiment
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="paper-card group hover:glow-subtle transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Recent Experiments */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Experiments
            </CardTitle>
            <CardDescription>
              Latest autonomous research experiments and their outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExperiments.map((experiment, index) => {
                const StatusIcon = getStatusIcon(experiment.status);
                return (
                  <motion.div
                    key={experiment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        <Badge className={`${getStatusColor(experiment.status)} text-xs`}>
                          {experiment.status}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{experiment.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{experiment.date}</span>
                          <span>{experiment.duration}</span>
                          {experiment.accuracy && (
                            <span>Accuracy: {experiment.accuracy}%</span>
                          )}
                          {experiment.novelty && (
                            <span>Novelty: {experiment.novelty}%</span>
                          )}
                        </div>
                        
                        {experiment.status === 'running' && (
                          <div className="mt-2">
                            <Progress value={experiment.progress} className="w-full h-2" />
                            <span className="text-xs text-muted-foreground">{experiment.progress}% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time agent performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <Progress value={67} className="w-full" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <Progress value={42} className="w-full" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">GPU Utilization</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <Progress value={89} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="paper-card">
          <CardHeader>
            <CardTitle>Research Pipeline</CardTitle>
            <CardDescription>Current workflow status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Paper Ingestion', 'Idea Generation', 'Implementation', 'Benchmarking'].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`progress-step ${index <= 1 ? 'active' : ''} ${index === 0 ? 'complete' : ''}`}>
                    {index === 0 ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                  {index === 1 && <Badge variant="outline" className="ml-auto animate-pulse">Active</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;