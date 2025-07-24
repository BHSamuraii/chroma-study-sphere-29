
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import EdTechHomepage from "@/components/EdTechHomepage";
import Dashboard from "@/pages/Dashboard";
import './index.css'

const queryClient = new QueryClient();

// Check if we're in WordPress environment
const isWordPress = window.location.hostname !== 'localhost' && 
                   window.location.hostname !== '127.0.0.1' &&
                   !window.location.hostname.includes('lovableproject.com');

// Single App component for routing (Lovable preview only)
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<EdTechHomepage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// WordPress component (no routing)
const WordPressApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <EdTechHomepage />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Initialize the app
function initializeApp() {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }

  console.log('Initializing React app...', { isWordPress, hostname: window.location.hostname });

  try {
    const root = createRoot(rootElement);
    
    if (isWordPress) {
      console.log('Rendering WordPress version without routing');
      root.render(<WordPressApp />);
    } else {
      console.log('Rendering full app with routing');
      root.render(<App />);
    }
    
    console.log('React app initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize React app:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
