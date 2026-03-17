import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useKindeAuth, KindeProvider } from "@kinde-oss/kinde-auth-react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import PsychiatristDashboard from "./pages/PsychiatristDashboard";
import TherapistDashboard from "./pages/TherapistDashboard";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { useSyncUser } from "./hooks/useSyncUser";
import { useProfile } from "./hooks/useProfile";
import { SyncContext } from "./context/SyncContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 2 } },
});

// ─── Spinner helper ──────────────────────────────────────────
const FullScreenSpinner = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// ─── RedirectHandler ─────────────────────────────────────────
// Wraps public pages. Redirects to dashboard if already logged in.
const RedirectHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useKindeAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();

  // Still resolving auth / profile
  if (isAuthLoading || (isAuthenticated && isProfileLoading)) {
    return <FullScreenSpinner />;
  }

  // Authenticated + profile found → go to the correct dashboard
  if (isAuthenticated && profile?.role) {
    const roleRoutes: Record<string, string> = {
      patient: "/patient",
      psychiatrist: "/psychiatrist",
      therapist: "/therapist",
    };
    const target = roleRoutes[profile.role];
    if (target) return <Navigate to={target} replace />;
  }

  // Authenticated but no profile = INSERT failed (SQL not run yet)
  if (isAuthenticated && !isProfileLoading && !profile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background p-8">
        <div className="max-w-md text-center bg-card border border-destructive/30 rounded-2xl p-8 shadow-lg">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-display font-bold mb-2">Profile Setup Required</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your account authenticated successfully, but your profile couldn't be saved.
            This may be due to a temporary database issue or an incomplete setup.
            <br /><br />
            Please contact support if this persists, then sign in again.
          </p>
          <button
            onClick={() => logout({ redirectUrl: window.location.origin })}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign Out &amp; Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ─── ProtectedRoute ──────────────────────────────────────────
// Ensures user is logged in AND has the expected role.
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: "patient" | "psychiatrist" | "therapist";
}) => {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();

  if (isLoading || isProfileLoading) return <FullScreenSpinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (profile && profile.role !== requiredRole) {
    const roleRoutes: Record<string, string> = {
      patient: "/patient",
      psychiatrist: "/psychiatrist",
      therapist: "/therapist",
    };
    return <Navigate to={roleRoutes[profile.role] || "/login"} replace />;
  }

  if (!profile) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// ─── AppContent ───────────────────────────────────────────────
const AppContent = () => {
  const syncState = useSyncUser();

  return (
    <SyncContext.Provider value={syncState}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectHandler><Index /></RedirectHandler>} />
          <Route path="/login" element={<RedirectHandler><Login /></RedirectHandler>} />
          <Route path="/signup" element={<RedirectHandler><Signup /></RedirectHandler>} />

          <Route path="/patient" element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/psychiatrist" element={<ProtectedRoute requiredRole="psychiatrist"><PsychiatristDashboard /></ProtectedRoute>} />
          <Route path="/therapist" element={<ProtectedRoute requiredRole="therapist"><TherapistDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SyncContext.Provider>
  );
};

// ─── App root ─────────────────────────────────────────────────
const App = () => (
  <KindeProvider
    clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
    domain={import.meta.env.VITE_KINDE_DOMAIN}
    redirectUri={window.location.origin}
    logoutUri={window.location.origin}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </KindeProvider>
);

export default App;
