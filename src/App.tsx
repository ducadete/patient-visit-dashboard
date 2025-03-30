
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { VisitProvider } from "./contexts/VisitContext";
import { ProfessionalProvider } from "./contexts/ProfessionalContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VisitRegistration from "./pages/VisitRegistration";
import VisitsList from "./pages/VisitsList";
import PatientVisits from "./pages/PatientVisits";
import SystemManagement from "./pages/SystemManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Private route component to protect routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin route component to protect admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <VisitRegistration />
        </PrivateRoute>
      } />
      
      <Route path="/visits" element={
        <PrivateRoute>
          <VisitsList />
        </PrivateRoute>
      } />
      
      <Route path="/patient/:patientName" element={
        <PrivateRoute>
          <PatientVisits />
        </PrivateRoute>
      } />
      
      <Route path="/system" element={
        <PrivateRoute>
          <SystemManagement />
        </PrivateRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfessionalProvider>
        <VisitProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
              <AppRoutes />
          </TooltipProvider>
        </VisitProvider>
      </ProfessionalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
