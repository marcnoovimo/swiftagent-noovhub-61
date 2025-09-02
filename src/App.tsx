
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
// Eager load critical components
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Index from './pages/Index';
import Documents from './pages/Documents';
import Contacts from './pages/Contacts';

// Lazy load non-critical components
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Messages = lazy(() => import('./pages/Messages'));
const Stats = lazy(() => import('./pages/Stats'));
const MonthlyReport = lazy(() => import('./pages/MonthlyReport'));
const Team = lazy(() => import('./pages/Team'));
const AgentDetail = lazy(() => import('./pages/AgentDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const AgentProfile = lazy(() => import('./pages/AgentProfile'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Settings = lazy(() => import('./pages/Settings'));
const Support = lazy(() => import('./pages/Support'));
const NotionIntegration = lazy(() => import('./pages/NotionIntegration'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="noovimo-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/agent/:id" element={<AgentDetail />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/monthly-report" element={<MonthlyReport />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/agent-profile" element={<AgentProfile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/notion-integration" element={<NotionIntegration />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
