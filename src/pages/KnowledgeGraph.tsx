import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Download,
  RefreshCw,
  Network,
  FileText,
  Database,
  BarChart3,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Handle,
  Position,
} from 'reactflow';

import 'reactflow/dist/style.css';

// Custom node types
const PaperNode = ({ data }: { data: any }) => (
  <div className="bg-card border-2 border-primary/30 rounded-lg p-3 min-w-[200px] shadow-lg">
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-2">
      <FileText className="w-4 h-4 text-primary" />
      <span className="font-medium text-sm">{data.title}</span>
    </div>
    <div className="text-xs text-muted-foreground mb-2">{data.authors}</div>
    <div className="flex flex-wrap gap-1">
      {data.keywords?.slice(0, 3).map((keyword: string, idx: number) => (
        <Badge key={idx} variant="outline" className="text-xs">
          {keyword}
        </Badge>
      ))}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const MethodNode = ({ data }: { data: any }) => (
  <div className="bg-card border-2 border-accent/30 rounded-lg p-3 min-w-[150px] shadow-lg">
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-1">
      <Brain className="w-4 h-4 text-accent" />
      <span className="font-medium text-sm">{data.name}</span>
    </div>
    <div className="text-xs text-muted-foreground">{data.category}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const DatasetNode = ({ data }: { data: any }) => (
  <div className="bg-card border-2 border-success/30 rounded-lg p-3 min-w-[150px] shadow-lg">
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-1">
      <Database className="w-4 h-4 text-success" />
      <span className="font-medium text-sm">{data.name}</span>
    </div>
    <div className="text-xs text-muted-foreground">{data.domain}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const MetricNode = ({ data }: { data: any }) => (
  <div className="bg-card border-2 border-warning/30 rounded-lg p-3 min-w-[120px] shadow-lg">
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-1">
      <BarChart3 className="w-4 h-4 text-warning" />
      <span className="font-medium text-sm">{data.name}</span>
    </div>
    <div className="text-xs text-muted-foreground">{data.value}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const nodeTypes = {
  paper: PaperNode,
  method: MethodNode,
  dataset: DatasetNode,
  metric: MetricNode,
};

// Mock knowledge graph data
const initialNodes: Node[] = [
  {
    id: 'paper-1',
    type: 'paper',
    position: { x: 250, y: 50 },
    data: { 
      title: 'Attention Is All You Need',
      authors: 'Vaswani et al.',
      keywords: ['Transformer', 'Attention', 'NLP']
    },
  },
  {
    id: 'paper-2',
    type: 'paper',
    position: { x: 600, y: 50 },
    data: { 
      title: 'BERT: Pre-training',
      authors: 'Devlin et al.',
      keywords: ['BERT', 'Bidirectional', 'Transformers']
    },
  },
  {
    id: 'method-1',
    type: 'method',
    position: { x: 100, y: 200 },
    data: { 
      name: 'Self-Attention',
      category: 'Attention Mechanism'
    },
  },
  {
    id: 'method-2',
    type: 'method',
    position: { x: 400, y: 200 },
    data: { 
      name: 'Transformer',
      category: 'Neural Architecture'
    },
  },
  {
    id: 'method-3',
    type: 'method',
    position: { x: 700, y: 200 },
    data: { 
      name: 'Masked Language Modeling',
      category: 'Pre-training'
    },
  },
  {
    id: 'dataset-1',
    type: 'dataset',
    position: { x: 200, y: 350 },
    data: { 
      name: 'WMT 2014',
      domain: 'Machine Translation'
    },
  },
  {
    id: 'dataset-2',
    type: 'dataset',
    position: { x: 500, y: 350 },
    data: { 
      name: 'GLUE',
      domain: 'Language Understanding'
    },
  },
  {
    id: 'metric-1',
    type: 'metric',
    position: { x: 150, y: 500 },
    data: { 
      name: 'BLEU Score',
      value: '28.4'
    },
  },
  {
    id: 'metric-2',
    type: 'metric',
    position: { x: 350, y: 500 },
    data: { 
      name: 'Accuracy',
      value: '94.2%'
    },
  },
  {
    id: 'metric-3',
    type: 'metric',
    position: { x: 550, y: 500 },
    data: { 
      name: 'F1 Score',
      value: '92.1'
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'paper-1', target: 'method-1', type: 'smoothstep' },
  { id: 'e2', source: 'paper-1', target: 'method-2', type: 'smoothstep' },
  { id: 'e3', source: 'paper-2', target: 'method-3', type: 'smoothstep' },
  { id: 'e4', source: 'method-2', target: 'dataset-1', type: 'smoothstep' },
  { id: 'e5', source: 'method-3', target: 'dataset-2', type: 'smoothstep' },
  { id: 'e6', source: 'dataset-1', target: 'metric-1', type: 'smoothstep' },
  { id: 'e7', source: 'dataset-2', target: 'metric-2', type: 'smoothstep' },
  { id: 'e8', source: 'dataset-2', target: 'metric-3', type: 'smoothstep' },
];

const KnowledgeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState("all");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.data.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || node.type === filterType;
    return matchesSearch && matchesType;
  });

  const getNodeTypeStats = () => {
    const stats = nodes.reduce((acc, node) => {
      acc[node.type || 'unknown'] = (acc[node.type || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const stats = getNodeTypeStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Knowledge Graph Viewer
        </h1>
        <p className="text-muted-foreground mt-2">
          Interactive visualization of research relationships between papers, methods, datasets, and metrics
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search papers, methods, datasets, metrics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'paper', 'method', 'dataset', 'metric'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type)}
                    className="capitalize"
                  >
                    {type === 'all' ? 'All' : type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="paper-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.paper || 0}</div>
            <div className="text-sm text-muted-foreground">Papers</div>
          </CardContent>
        </Card>
        <Card className="paper-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{stats.method || 0}</div>
            <div className="text-sm text-muted-foreground">Methods</div>
          </CardContent>
        </Card>
        <Card className="paper-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{stats.dataset || 0}</div>
            <div className="text-sm text-muted-foreground">Datasets</div>
          </CardContent>
        </Card>
        <Card className="paper-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{stats.metric || 0}</div>
            <div className="text-sm text-muted-foreground">Metrics</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Graph Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-3"
        >
          <Card className="paper-card">
            <CardContent className="p-0">
              <div className="w-full h-[600px] rounded-lg overflow-hidden">
                <ReactFlow
                  nodes={filteredNodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  className="bg-background"
                  fitView
                >
                  <Background color="#aaa" gap={16} />
                  <Controls className="bg-card border border-border" />
                  <MiniMap 
                    className="bg-card border border-border"
                    nodeColor={(node) => {
                      switch (node.type) {
                        case 'paper': return 'hsl(var(--primary))';
                        case 'method': return 'hsl(var(--accent))';
                        case 'dataset': return 'hsl(var(--success))';
                        case 'metric': return 'hsl(var(--warning))';
                        default: return 'hsl(var(--muted))';
                      }
                    }}
                  />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Node Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="paper-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Node Details
              </CardTitle>
              <CardDescription>
                Click on any node to view detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {selectedNode.type === 'paper' && <FileText className="w-4 h-4 text-primary" />}
                    {selectedNode.type === 'method' && <Brain className="w-4 h-4 text-accent" />}
                    {selectedNode.type === 'dataset' && <Database className="w-4 h-4 text-success" />}
                    {selectedNode.type === 'metric' && <BarChart3 className="w-4 h-4 text-warning" />}
                    <Badge variant="outline" className="capitalize">
                      {selectedNode.type}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">
                      {selectedNode.data.title || selectedNode.data.name}
                    </h3>
                    
                    {selectedNode.data.authors && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Authors: {selectedNode.data.authors}
                      </p>
                    )}
                    
                    {selectedNode.data.category && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Category: {selectedNode.data.category}
                      </p>
                    )}
                    
                    {selectedNode.data.domain && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Domain: {selectedNode.data.domain}
                      </p>
                    )}
                    
                    {selectedNode.data.value && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Value: {selectedNode.data.value}
                      </p>
                    )}
                  </div>

                  {selectedNode.data.keywords && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedNode.data.keywords.map((keyword: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/50">
                    <Button size="sm" className="w-full">
                      View Full Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Select a node to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="paper-card mt-6">
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span className="text-sm">Research Papers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span className="text-sm">Methods</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span className="text-sm">Datasets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span className="text-sm">Metrics</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;