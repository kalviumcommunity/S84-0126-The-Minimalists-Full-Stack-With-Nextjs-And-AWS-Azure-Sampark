import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";

// Eager load home page for better first contentful paint
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load other pages to reduce initial bundle size
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const VerifyOTP = lazy(() => import("./pages/auth/VerifyOTP"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AllGrievances = lazy(() => import("./pages/admin/AllGrievances"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminRoute = lazy(() => import("./components/AdminRoute"));

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Index />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Dashboard />
            </motion.div>
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Login />
            </motion.div>
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<LoadingSpinner />}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Signup />
            </motion.div>
          </Suspense>
        } />
        <Route path="/verify-otp" element={
          <Suspense fallback={<LoadingSpinner />}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <VerifyOTP />
            </motion.div>
          </Suspense>
        } />
        
        {/* Admin Routes with persistent layout - Protected */}
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </Suspense>
        }>
          <Route path="dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          } />
          <Route path="grievances" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AllGrievances />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminUsers />
            </Suspense>
          } />
          <Route path="analytics" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminAnalytics />
            </Suspense>
          } />
        </Route>
        
        {/* Catch-all */}
        <Route path="*" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <NotFound />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
