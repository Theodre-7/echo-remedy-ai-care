
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Scan from "./pages/Scan";
import Journal from "./pages/Journal";
import HealthTips from "./pages/HealthTips";
import ScanHistory from "./pages/ScanHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import MedxoChatbot from "./components/MedxoChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/scan" element={
              <ProtectedRoute>
                <Scan />
              </ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            } />
            <Route path="/health-tips" element={
              <ProtectedRoute>
                <HealthTips />
              </ProtectedRoute>
            } />
            <Route path="/scan-history" element={
              <ProtectedRoute>
                <ScanHistory />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MedxoChatbot autoShow={false} />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
