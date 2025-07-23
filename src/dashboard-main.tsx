
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";
import "./index.css";

const queryClient = new QueryClient();

// For WordPress integration, render the dashboard directly
const DashboardApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Dashboard />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("dashboard-root")!).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>,
);
