import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Link, 
  X, 
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Mock data for uploaded papers
const mockUploadedPapers = [
  {
    id: "paper_001",
    name: "Attention Is All You Need.pdf",
    size: "2.4 MB",
    status: "processed",
    extractedEntities: {
      methods: ["Transformer", "Self-Attention", "Multi-Head Attention"],
      datasets: ["WMT 2014", "English-German", "English-French"],
      metrics: ["BLEU Score", "Perplexity"]
    },
    uploadDate: "2024-01-15",
    processingTime: "45s"
  },
  {
    id: "paper_002",
    name: "BERT: Pre-training of Deep Bidirectional Transformers.pdf", 
    size: "3.1 MB",
    status: "processing",
    extractedEntities: null,
    uploadDate: "2024-01-15",
    processingTime: null,
    progress: 67
  }
];

const UploadPapers = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(mockUploadedPapers);
  const [arxivUrl, setArxivUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file.type === "application/pdf") {
      toast.success(`Uploaded ${file.name}`);
      // Mock file processing
      const newFile = {
        id: `paper_${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: "processing" as const,
        extractedEntities: null,
        uploadDate: new Date().toISOString().split('T')[0],
        processingTime: null,
        progress: 0
      };
      setUploadedFiles(prev => [newFile, ...prev]);
      
      // Simulate processing
      simulateProcessing(newFile.id);
    } else {
      toast.error("Please upload PDF files only");
    }
  };

  const simulateProcessing = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update file status to processed
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? {
                ...file,
                status: "processed" as const,
                progress: 100,
                processingTime: "32s",
                extractedEntities: {
                  methods: ["Neural Network", "Deep Learning", "Backpropagation"],
                  datasets: ["CIFAR-10", "ImageNet"],
                  metrics: ["Accuracy", "F1-Score"]
                }
              }
            : file
        ));
        toast.success("Paper processed successfully!");
      } else {
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, progress } : file
        ));
      }
    }, 500);
  };

  const handleArxivSubmit = () => {
    if (!arxivUrl.trim()) {
      toast.error("Please enter an arXiv URL");
      return;
    }
    
    setIsProcessing(true);
    toast.success("Fetching paper from arXiv...");
    
    // Mock arXiv fetch
    setTimeout(() => {
      const fileName = `arXiv_${Date.now()}.pdf`;
      const newFile = {
        id: `paper_${Date.now()}`,
        name: fileName,
        size: "1.8 MB",
        status: "processing" as const,
        extractedEntities: null,
        uploadDate: new Date().toISOString().split('T')[0],
        processingTime: null,
        progress: 0
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
      setArxivUrl("");
      setIsProcessing(false);
      simulateProcessing(newFile.id);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-primary text-primary-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return CheckCircle;
      case 'processing': return Upload;
      case 'error': return AlertCircle;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Upload Research Papers
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload PDFs or fetch papers from arXiv to start the autonomous research process
        </p>
      </motion.div>

      {/* Upload Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="paper-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                File Upload
              </CardTitle>
              <CardDescription>
                Drag and drop PDF files or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium">Drop PDF files here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Supported: PDF files up to 10MB
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* arXiv URL */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="paper-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5 text-primary" />
                arXiv Import
              </CardTitle>
              <CardDescription>
                Fetch papers directly from arXiv using URLs or IDs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="arxiv-url">arXiv URL or ID</Label>
                  <Input
                    id="arxiv-url"
                    placeholder="https://arxiv.org/abs/1706.03762 or 1706.03762"
                    value={arxivUrl}
                    onChange={(e) => setArxivUrl(e.target.value)}
                    className="bg-muted/50 border-border/50"
                  />
                </div>
                
                <Button 
                  onClick={handleArxivSubmit}
                  disabled={isProcessing || !arxivUrl.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isProcessing ? (
                    <>
                      <Download className="w-4 h-4 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Fetch Paper
                    </>
                  )}
                </Button>

                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">Example URLs:</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>https://arxiv.org/abs/1706.03762</div>
                    <div>https://arxiv.org/pdf/1706.03762.pdf</div>
                    <div>1706.03762</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Uploaded Papers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="paper-card">
          <CardHeader>
            <CardTitle>Uploaded Papers</CardTitle>
            <CardDescription>
              Manage and view extracted information from uploaded research papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => {
                const StatusIcon = getStatusIcon(file.status);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="border border-border/50 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{file.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {file.size} • {file.uploadDate}
                            {file.processingTime && ` • Processed in ${file.processingTime}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(file.status)}>
                          {file.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {file.status === 'processing' && typeof file.progress === 'number' && (
                      <div>
                        <Progress value={file.progress} className="w-full" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Processing... {Math.round(file.progress)}%
                        </p>
                      </div>
                    )}

                    {file.extractedEntities && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground">Methods</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.extractedEntities.methods.map((method, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground">Datasets</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.extractedEntities.datasets.map((dataset, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {dataset}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground">Metrics</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.extractedEntities.metrics.map((metric, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {uploadedFiles.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No papers uploaded yet</p>
                  <p className="text-sm">Upload PDF files or fetch from arXiv to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadPapers;