import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  User, 
  Bot, 
  Download, 
  Play, 
  Pause,
  Settings,
  MessageSquare,
  Brain,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

// Mock chat messages
const mockMessages = [
  {
    id: "msg_001",
    type: "assistant" as const,
    content: "Hello! I'm AIREX, your autonomous research assistant. I can help you generate ideas, implement code, run benchmarks, and optimize research methodologies. What would you like to work on today?",
    timestamp: "2024-01-15T10:00:00Z",
    agent: "system"
  },
  {
    id: "msg_002", 
    type: "user" as const,
    content: "Generate ideas for improving few-shot classification accuracy in NLP tasks",
    timestamp: "2024-01-15T10:01:00Z",
    agent: null
  },
  {
    id: "msg_003",
    type: "assistant" as const,
    content: `Based on the latest research papers in my knowledge base, here are 5 innovative ideas for improving few-shot classification:\n\n**1. Meta-Learning with Adaptive Prototypical Networks**\n- Combine prototypical networks with MAML for better adaptation\n- Expected improvement: 12-15% accuracy boost\n- Implementation complexity: Medium\n\n**2. Cross-lingual Transfer with Multilingual Embeddings**\n- Leverage cross-lingual patterns for data augmentation\n- Expected improvement: 8-10% accuracy boost\n- Implementation complexity: Low\n\n**3. Hierarchical Attention with Task-Specific Adapters**\n- Use hierarchical attention mechanisms with lightweight adapters\n- Expected improvement: 10-12% accuracy boost\n- Implementation complexity: High\n\nWould you like me to implement any of these approaches?`,
    timestamp: "2024-01-15T10:02:00Z", 
    agent: "idea_generation"
  }
];

const agentColors = {
  system: "bg-primary/20 text-primary",
  idea_generation: "bg-purple-500/20 text-purple-400",
  code_implementation: "bg-green-500/20 text-green-400",
  benchmark: "bg-blue-500/20 text-blue-400",
  refactoring: "bg-orange-500/20 text-orange-400"
};

const ChatInterface = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const simulateTyping = (message: string, agent: string = "system") => {
    setIsTyping(true);
    setStreamingMessage("");
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setStreamingMessage(prev => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        
        // Add complete message to chat
        const newMessage = {
          id: `msg_${Date.now()}`,
          type: "assistant" as const,
          content: message,
          timestamp: new Date().toISOString(),
          agent
        };
        
        setMessages(prev => [...prev, newMessage]);
        setStreamingMessage("");
      }
    }, 20);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: `msg_${Date.now()}`,
      type: "user" as const,
      content: inputValue,
      timestamp: new Date().toISOString(),
      agent: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'm analyzing your request and consulting my knowledge base of research papers...",
        "Based on recent developments in the field, I recommend exploring transformer-based approaches with attention mechanisms. Let me implement a prototype for you.",
        "I found 3 relevant papers that address this problem. Let me extract the key methodologies and generate an optimized implementation.",
        "Running benchmark tests on the generated code... Initial results show promising improvements in accuracy and efficiency."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const agents = ["idea_generation", "code_implementation", "benchmark"];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      
      simulateTyping(randomResponse, randomAgent);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.type === 'user' ? 'User' : 'AIREX'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airex-chat-history.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chat history exported!");
  };

  const triggerAgent = (agentType: string) => {
    const agentResponses = {
      idea: "Generating new research ideas based on your recent interactions...",
      code: "Implementing the discussed methodology in Python with PyTorch...",
      benchmark: "Running comprehensive benchmarks on the latest implementations..."
    };
    
    simulateTyping(agentResponses[agentType as keyof typeof agentResponses] || agentResponses.idea, agentType);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Chat Interface
          </h1>
          <p className="text-muted-foreground">
            Interact with AIREX agents in {isAutonomous ? 'autonomous' : 'interactive'} mode
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => triggerAgent('idea')}
              className="bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate Ideas
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => triggerAgent('code')}
              className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
            >
              <Code className="w-4 h-4 mr-2" />
              Implement Code
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportChat}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border">
            <Label htmlFor="autonomous-mode" className="text-sm cursor-pointer">
              {isAutonomous ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Label>
            <Switch 
              id="autonomous-mode"
              checked={isAutonomous}
              onCheckedChange={setIsAutonomous}
            />
            <Label htmlFor="autonomous-mode" className="text-xs cursor-pointer">
              {isAutonomous ? 'Auto' : 'Manual'}
            </Label>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col paper-card">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-4xl ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`chat-message ${message.type}`}>
                      {message.agent && message.type === 'assistant' && (
                        <Badge className={`mb-2 ${agentColors[message.agent as keyof typeof agentColors] || agentColors.system}`}>
                          {message.agent.replace('_', ' ')}
                        </Badge>
                      )}
                      
                      <div className="prose prose-sm max-w-none text-foreground">
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="chat-message assistant">
                  <div className="whitespace-pre-wrap">
                    {streamingMessage}
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isAutonomous 
                      ? "System is running autonomously. Switch to Interactive mode to send messages."
                      : "Ask AIREX to generate ideas, implement code, or run benchmarks..."
                  }
                  disabled={isAutonomous || isTyping}
                  className="bg-muted/50 border-border/50 pr-12"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {inputValue.length}/1000
                </div>
              </div>
              
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isAutonomous || isTyping}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Commands */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Generate research ideas for transformer optimization",
                "Implement a new attention mechanism",
                "Benchmark the latest model on GLUE tasks",
                "Optimize memory usage in the current implementation"
              ].map((command, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(command)}
                  disabled={isAutonomous}
                  className="text-xs bg-muted/30 hover:bg-muted/50"
                >
                  {command}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;