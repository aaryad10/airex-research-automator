import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Eye,
  Download,
  ChevronDown,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock experiments data
const mockExperiments = [
  {
    id: "exp_2024_001",
    title: "Few-shot Classification with BERT Fine-tuning",
    description: "Autonomous exploration of BERT fine-tuning strategies for few-shot text classification tasks",
    status: "complete",
    mode: "autonomous",
    startDate: "2024-01-15T09:00:00Z",
    endDate: "2024-01-15T11:34:00Z",
    duration: "2h 34m",
    inputQuery: "Improve few-shot classification accuracy on intent detection",
    inputPaper: null,
    metrics: {
      accuracy: 94.2,
      noveltyScore: 87,
      efficiencyGain: 23,
      ragAccuracy: 91
    },
    outputs: {
      codeGenerated: true,
      benchmarkResults: true,
      refactoredCode: true,
      deployed: false
    },
    tags: ["NLP", "Few-shot Learning", "BERT", "Classification"]
  },
  {
    id: "exp_2024_002",
    title: "Neural Architecture Search for Transformer Optimization",
    description: "Systematic exploration of transformer architectures for improved computational efficiency",
    status: "running",
    mode: "interactive",
    startDate: "2024-01-15T14:20:00Z",
    endDate: null,
    duration: "4h 12m",
    inputQuery: "Find optimal transformer architecture for resource-constrained environments",
    inputPaper: "Attention Is All You Need",
    metrics: {
      accuracy: 89.1,
      noveltyScore: 92,
      efficiencyGain: 45,
      ragAccuracy: 88
    },
    outputs: {
      codeGenerated: true,
      benchmarkResults: false,
      refactoredCode: false,
      deployed: false
    },
    tags: ["Architecture Search", "Transformers", "Optimization", "Efficiency"]
  },
  {
    id: "exp_2024_003",
    title: "RAG System Enhancement with Multi-hop Reasoning",
    description: "Implementing multi-hop reasoning capabilities for improved RAG performance",
    status: "failed",
    mode: "autonomous", 
    startDate: "2024-01-14T16:45:00Z",
    endDate: "2024-01-14T17:30:00Z",
    duration: "45m",
    inputQuery: "Enhance RAG with multi-hop reasoning for complex queries",
    inputPaper: null,
    metrics: {
      accuracy: null,
      noveltyScore: null,
      efficiencyGain: null,
      ragAccuracy: 76
    },
    outputs: {
      codeGenerated: true,
      benchmarkResults: false,
      refactoredCode: false,
      deployed: false
    },
    tags: ["RAG", "Multi-hop Reasoning", "Information Retrieval"]
  },
  {
    id: "exp_2024_004",
    title: "Multimodal Learning with Vision-Language Transformers", 
    description: "Exploring cross-modal attention mechanisms for improved multimodal understanding",
    status: "pending",
    mode: "interactive",
    startDate: "2024-01-16T10:00:00Z",
    endDate: null,
    duration: null,
    inputQuery: "Develop multimodal transformer for image-text understanding",
    inputPaper: "CLIP: Learning Transferable Visual Models",
    metrics: {
      accuracy: null,
      noveltyScore: null,
      efficiencyGain: null,
      ragAccuracy: null
    },
    outputs: {
      codeGenerated: false,
      benchmarkResults: false,
      refactoredCode: false,
      deployed: false
    },
    tags: ["Multimodal", "Vision-Language", "CLIP", "Cross-modal"]
  }
];

const ExperimentsHistory = () => {
  const [experiments, setExperiments] = useState(mockExperiments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [expandedExperiments, setExpandedExperiments] = useState<string[]>([]);

  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || exp.status === statusFilter;
    const matchesMode = modeFilter === "all" || exp.mode === modeFilter;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-success text-success-foreground';
      case 'running': return 'bg-primary text-primary-foreground'; 
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return CheckCircle;
      case 'running': return Play;
      case 'failed': return AlertCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const toggleExpanded = (experimentId: string) => {
    setExpandedExperiments(prev => 
      prev.includes(experimentId) 
        ? prev.filter(id => id !== experimentId)
        : [...prev, experimentId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Experiments History
        </h1>
        <p className="text-muted-foreground mt-2">
          Track and analyze past research experiments and their outcomes
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="paper-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search experiments, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="autonomous">Autonomous</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Experiments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredExperiments.map((experiment, index) => {
          const StatusIcon = getStatusIcon(experiment.status);
          const isExpanded = expandedExperiments.includes(experiment.id);
          
          return (
            <motion.div
              key={experiment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="paper-card">
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(experiment.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <StatusIcon className="w-5 h-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{experiment.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {experiment.description}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(experiment.status)}>
                            {experiment.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {experiment.mode}
                          </Badge>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(experiment.startDate)}
                        </span>
                        {experiment.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {experiment.duration}
                          </span>
                        )}
                        <span>ID: {experiment.id}</span>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-6">
                      {/* Input Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Input</h4>
                          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                            <div>
                              <span className="text-sm font-medium">Query: </span>
                              <span className="text-sm">{experiment.inputQuery}</span>
                            </div>
                            {experiment.inputPaper && (
                              <div>
                                <span className="text-sm font-medium">Paper: </span>
                                <span className="text-sm">{experiment.inputPaper}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {experiment.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      {experiment.status !== 'pending' && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Metrics</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {experiment.metrics.accuracy && (
                              <div className="bg-muted/30 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-success">{experiment.metrics.accuracy}%</div>
                                <div className="text-xs text-muted-foreground">Accuracy</div>
                              </div>
                            )}
                            {experiment.metrics.noveltyScore && (
                              <div className="bg-muted/30 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-primary">{experiment.metrics.noveltyScore}%</div>
                                <div className="text-xs text-muted-foreground">Novelty</div>
                              </div>
                            )}
                            {experiment.metrics.efficiencyGain && (
                              <div className="bg-muted/30 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-accent">+{experiment.metrics.efficiencyGain}%</div>
                                <div className="text-xs text-muted-foreground">Efficiency</div>
                              </div>
                            )}
                            {experiment.metrics.ragAccuracy && (
                              <div className="bg-muted/30 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-warning">{experiment.metrics.ragAccuracy}%</div>
                                <div className="text-xs text-muted-foreground">RAG Accuracy</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Outputs */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Outputs</h4>
                        <div className="flex flex-wrap gap-4">
                          <div className={`flex items-center gap-2 ${experiment.outputs.codeGenerated ? 'text-success' : 'text-muted-foreground'}`}>
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Code Generated</span>
                          </div>
                          <div className={`flex items-center gap-2 ${experiment.outputs.benchmarkResults ? 'text-success' : 'text-muted-foreground'}`}>
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-sm">Benchmark Results</span>
                          </div>
                          <div className={`flex items-center gap-2 ${experiment.outputs.refactoredCode ? 'text-success' : 'text-muted-foreground'}`}>
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">Refactored Code</span>
                          </div>
                          <div className={`flex items-center gap-2 ${experiment.outputs.deployed ? 'text-success' : 'text-muted-foreground'}`}>
                            <Play className="w-4 h-4" />
                            <span className="text-sm">Deployed</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Results
                          </Button>
                        </div>
                        
                        {experiment.status === 'complete' && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            <Play className="w-4 h-4 mr-2" />
                            Re-run Experiment
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>
          );
        })}

        {filteredExperiments.length === 0 && (
          <Card className="paper-card">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No experiments found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || modeFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "No experiments have been run yet"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ExperimentsHistory;