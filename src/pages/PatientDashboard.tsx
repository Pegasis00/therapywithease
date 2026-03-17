import { useState, useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useProfile } from "@/hooks/useProfile";
import { SydneyAI } from "@/components/dashboard/SydneyAI";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { PHQ9Test } from "@/components/dashboard/PHQ9Test";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Sparkles, BarChart2, ClipboardList, Calendar,
  Users, Home, ChevronRight, Heart, TrendingUp, Menu, Bell
} from "lucide-react";

type View = "home" | "sydney" | "mood" | "assessment" | "appointments" | "groups";

const moodOptions = [
  { label: "Great", emoji: "😄", score: 5 },
  { label: "Good", emoji: "🙂", score: 4 },
  { label: "Okay", emoji: "😐", score: 3 },
  { label: "Low", emoji: "😔", score: 2 },
  { label: "Not Good", emoji: "😢", score: 1 },
];

const navItems = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "sydney", label: "Sydney AI", icon: Sparkles },
  { id: "mood", label: "Mood Tracker", icon: BarChart2 },
  { id: "assessment", label: "Self-Assessment", icon: ClipboardList },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "groups", label: "Support Groups", icon: Users },
];

// ── Sidebar — module-level (never redefined inside render) ──────
interface SidebarProps {
  activeView: View;
  setActiveView: (v: View) => void;
  setSidebarOpen: (b: boolean) => void;
  firstName: string;
  profileName?: string;
  profileEmail?: string;
  onLogout: () => void;
}

const Sidebar = ({
  activeView, setActiveView, setSidebarOpen,
  firstName, profileName, profileEmail, onLogout,
}: SidebarProps) => (
  <div className="flex flex-col h-full">
    <div className="px-5 py-5 border-b border-border/50">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm" />
          <Heart className="relative h-6 w-6 text-primary" strokeWidth={1.5} />
        </div>
        <span className="font-display font-bold text-lg">TherapEASE</span>
      </div>
    </div>

    {/* Sydney highlight in sidebar */}
    <div className="mx-3 mt-4 mb-2">
      <button
        onClick={() => { setActiveView("sydney"); setSidebarOpen(false); }}
        className={`w-full relative overflow-hidden rounded-2xl p-4 text-left group transition-all ${activeView === "sydney" ? "ring-2 ring-white/40" : ""
          }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Sydney AI</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 text-xs">Always here</span>
            </div>
          </div>
          <ChevronRight className={`h-4 w-4 text-white/60 ml-auto transition-transform ${activeView === "sydney" ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
        </div>
      </button>
    </div>

    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
      {navItems.filter(n => n.id !== "sydney").map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { setActiveView(item.id as View); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
            {item.label}
          </button>
        );
      })}
    </nav>

    <div className="mt-auto p-3 border-t border-border/50">
      <div className="flex items-center gap-3 px-3 py-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {firstName[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{profileName || firstName}</div>
          <div className="text-xs text-muted-foreground truncate">{profileEmail}</div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  </div>
);

// ── Main Dashboard ──────────────────────────────────────────────
const PatientDashboard = () => {
  const { user, logout, getToken } = useKindeAuth();
  const { data: profile } = useProfile();
  const [activeView, setActiveView] = useState<View>("home");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  // Floating Sydney — only shown when Sydney is NOT the active inline view
  const [floatingSydneyOpen, setFloatingSydneyOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Live stats
  const [stats, setStats] = useState({ daysTracked: 0, sessions: 0, lastPHQ9: "—" });

  const firstName = profile?.full_name?.split(" ")[0] || user?.givenName || "there";

  // Load live stats on mount
  useEffect(() => {
    if (!user?.id) return;
    const fetchStats = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch('/api/dashboard/patient/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch stats");
        
        const data = await res.json();
        setStats({
          daysTracked: data.moodCount ?? 0,
          sessions: data.sessionCount ?? 0,
          lastPHQ9: data.latestPhq9Score != null ? `${data.latestPhq9Score}/27` : "—",
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchStats();
  }, [user?.id, getToken]);

  // Close floating Sydney when navigating to the Sydney view
  useEffect(() => {
    if (activeView === "sydney") setFloatingSydneyOpen(false);
  }, [activeView]);

  const handleMood = async (mood: typeof moodOptions[0]) => {
    if (!user?.id) return;
    setSelectedMood(mood.label);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token");

      const res = await fetch('/api/mood_checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: mood.label,
          moodScore: mood.score
        })
      });

      if (!res.ok) throw new Error("Insertion failed");
      
      toast.success(`Mood logged: ${mood.label} ${mood.emoji}`);
      setStats(prev => ({ ...prev, daysTracked: prev.daysTracked + 1 }));
      
    } catch (err) {
      toast.error("Couldn't save mood"); 
      setSelectedMood(null);
    }
  };

  const sidebarProps: SidebarProps = {
    activeView, setActiveView, setSidebarOpen, firstName,
    profileName: profile?.full_name,
    profileEmail: profile?.email ?? "",
    onLogout: () => logout({ redirectUrl: window.location.origin }),
  };

  // ── Views ────────────────────────────────────────────────────
  const HomeView = (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">
          {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Here's your wellness overview for today</p>
      </div>

      {/* Sydney hero CTA */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => setActiveView("sydney")}
        className="relative overflow-hidden rounded-2xl cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_hsl(290_70%_70%/0.4),_transparent_60%)]" />
        <div className="orb w-40 h-40 bg-white/10 -top-10 right-10" />
        <div className="relative z-10 flex items-center justify-between p-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-xs font-medium">Sydney · Online</span>
              </div>
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-1">Talk to Sydney</h3>
            <p className="text-white/70 text-sm max-w-xs">Your AI companion is ready to listen and support you — anytime.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/50 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>
      </motion.div>

      {/* Quick mood */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-sm">How are you feeling right now?</h3>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((m) => (
            <motion.button
              key={m.label}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMood(m)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${selectedMood === m.label
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{m.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Moods Logged", val: String(stats.daysTracked), icon: BarChart2, color: "text-violet-500", bg: "bg-violet-500/10" },
          { label: "Sessions Done", val: String(stats.sessions), icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "PHQ-9 Score", val: stats.lastPHQ9, icon: ClipboardList, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className="text-xl font-display font-bold mb-0.5">{s.val}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mood chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> 7-Day Mood Trend
          </h3>
          <button onClick={() => setActiveView("mood")} className="text-xs text-primary hover:underline">View all →</button>
        </div>
        <MoodChart />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Chat with Sydney", icon: Sparkles, action: () => setActiveView("sydney"), gradient: "from-violet-500 to-purple-600" },
          { label: "Take PHQ-9", icon: ClipboardList, action: () => setActiveView("assessment"), gradient: "from-blue-500 to-cyan-500" },
          { label: "Book Session", icon: Calendar, action: () => setActiveView("appointments"), gradient: "from-emerald-500 to-teal-500" },
          { label: "Support Group", icon: Users, action: () => setActiveView("groups"), gradient: "from-orange-500 to-amber-500" },
        ].map((a) => (
          <motion.button
            key={a.label}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={a.action}
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 text-center"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-md`}>
              <a.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium leading-snug">{a.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const views: Record<View, React.ReactNode> = {
    home: HomeView,

    sydney: (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> Sydney AI
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Your personal AI companion — always here, always listening</p>
        </div>
        {/* Inline Sydney — always open in this view */}
        <SydneyAI isOpen={true} onClose={() => setActiveView("home")} inline />
      </div>
    ),

    mood: (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-display font-bold">Mood Tracker</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your emotional patterns over time</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Log Today's Mood</h3>
          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((m) => (
              <motion.button key={m.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} onClick={() => handleMood(m)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedMood === m.label ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xs font-medium">{m.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">7-Day Trend</h3>
          <MoodChart />
        </div>
      </div>
    ),

    assessment: (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Self-Assessment</h1>
          <p className="text-muted-foreground mt-1 text-sm">PHQ-9 standardised depression screening</p>
        </div>
        <PHQ9Test inline />
      </div>
    ),

    appointments: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Appointments</h1><p className="text-muted-foreground mt-1 text-sm">Your upcoming sessions</p></div>
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No upcoming appointments</h3>
          <p className="text-sm text-muted-foreground">Book a session with your therapist or psychiatrist</p>
        </div>
      </div>
    ),

    groups: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Support Groups</h1><p className="text-muted-foreground mt-1 text-sm">Connect with others on similar journeys</p></div>
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No groups yet</h3>
          <p className="text-sm text-muted-foreground">Your therapist will add you to relevant support groups</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-64 border-r border-border bg-card flex-shrink-0">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 lg:hidden"
            >
              <Sidebar {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border px-5 py-4 bg-card/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-semibold">
              {navItems.find(n => n.id === activeView)?.label ?? "Sydney AI"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-xl transition-colors relative">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            {/* Only show Sydney button in header when NOT already on Sydney view */}
            {activeView !== "sydney" && (
              <button
                onClick={() => setFloatingSydneyOpen(prev => !prev)}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-200 ${floatingSydneyOpen
                    ? "bg-gradient-to-r from-violet-700 to-purple-700 shadow-[0_4px_16px_hsl(262_68%_58%/0.4)]"
                    : "bg-gradient-to-r from-violet-500 to-purple-600 shadow-[0_4px_16px_hsl(262_68%_58%/0.25)] hover:opacity-95"
                  }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {floatingSydneyOpen ? "Close Sydney" : "Sydney"}
              </button>
            )}
            {/* When on Sydney view, show a close/back button instead */}
            {activeView === "sydney" && (
              <button
                onClick={() => setActiveView("home")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium hover:text-foreground transition-all duration-200"
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-5 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {views[activeView]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Floating Sydney — disabled when already on Sydney view */}
      {activeView !== "sydney" && (
        <SydneyAI isOpen={floatingSydneyOpen} onClose={() => setFloatingSydneyOpen(false)} />
      )}
    </div>
  );
};

export default PatientDashboard;
