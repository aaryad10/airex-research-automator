import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as HotToaster } from 'react-hot-toast';
import { SidebarProvider } from "@/components/ui/sidebar";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import UploadPapers from "./pages/UploadPapers";
import ChatInterface from "./pages/ChatInterface";
import ExperimentsHistory from "./pages/ExperimentsHistory";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="neural-bg min-h-screen">
          <HotToaster 
            position="top-right"
            toastOptions={{
              className: 'bg-card text-card-foreground border-border',
              duration: 4000,
            }}
          />
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="upload" element={<UploadPapers />} />
                <Route path="chat" element={<ChatInterface />} />
                <Route path="experiments" element={<ExperimentsHistory />} />
                <Route path="knowledge-graph" element={<KnowledgeGraph />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;