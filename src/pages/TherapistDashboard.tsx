import { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useProfile } from "@/hooks/useProfile";
import { ClinicalNoteEditor } from "@/components/dashboard/ClinicalNoteEditor";
import { SydneyAI } from "@/components/dashboard/SydneyAI";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Home, Users, FileText, MessageSquare, Menu, Bell,
  Sparkles, Calendar, ChevronRight, HeartHandshake, BookOpen
} from "lucide-react";

type View = "home" | "patients" | "sessions" | "notes" | "messages" | "groups" | "sydney";

const navItems = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "patients", label: "My Clients", icon: Users },
  { id: "sessions", label: "Sessions", icon: Calendar },
  { id: "notes", label: "Session Notes", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "groups", label: "Support Groups", icon: BookOpen },
];

// ── Sidebar ─────────────────────────────────────────────────────
interface SidebarProps {
  activeView: View;
  setActiveView: (v: View) => void;
  setSidebarOpen: (b: boolean) => void;
  firstName: string;
  profileName?: string;
  onLogout: () => void;
}

const Sidebar = ({ activeView, setActiveView, setSidebarOpen, firstName, profileName, onLogout }: SidebarProps) => (
  <div className="flex flex-col h-full">
    <div className="px-5 py-5 border-b border-border/50">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-sm" />
          <HeartHandshake className="relative h-6 w-6 text-emerald-500" strokeWidth={1.5} />
        </div>
        <div>
          <span className="font-display font-bold text-base block">TherapEASE</span>
          <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Therapist</span>
        </div>
      </div>
    </div>

    <div className="mx-3 mt-4 mb-2">
      <button
        onClick={() => { setActiveView("sydney"); setSidebarOpen(false); }}
        className="w-full relative overflow-hidden rounded-2xl p-3.5 text-left group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-xs">Sydney AI</div>
            <div className="text-white/70 text-[10px]">Session prep & insights</div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-white/60 ml-auto" />
        </div>
      </button>
    </div>

    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button key={item.id} onClick={() => { setActiveView(item.id as View); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive ? "bg-emerald-500/10 text-emerald-600 font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
            <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-emerald-600" : ""}`} />
            {item.label}
          </button>
        );
      })}
    </nav>

    <div className="mt-auto p-3 border-t border-border/50">
      <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {firstName[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{profileName || firstName}</div>
          <div className="text-xs text-muted-foreground">LMFT · Therapist</div>
        </div>
      </div>
      <button onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  </div>
);

// ── Main ────────────────────────────────────────────────────────
const TherapistDashboard = () => {
  const { logout } = useKindeAuth();
  const { data: profile } = useProfile();
  const [activeView, setActiveView] = useState<View>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sydneyOpen, setSydneyOpen] = useState(false);

  const firstName = profile?.full_name?.split(" ")[0] || "Therapist";

  const sidebarProps: SidebarProps = {
    activeView, setActiveView, setSidebarOpen, firstName,
    profileName: profile?.full_name,
    onLogout: () => logout({ redirectUrl: window.location.origin }),
  };

  const HomeView = (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Good day, {firstName} 💚</h1>
        <p className="text-muted-foreground mt-1">Here's your session overview for today</p>
      </div>

      <motion.div whileHover={{ y: -2 }} onClick={() => setActiveView("sydney")}
        className="relative overflow-hidden rounded-2xl cursor-pointer group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_hsl(160_60%_65%/0.4),_transparent_60%)]" />
        <div className="orb w-32 h-32 bg-white/10 -top-8 right-16" />
        <div className="relative z-10 flex items-center justify-between p-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-white" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                <span className="text-white/80 text-xs font-medium">Sydney AI</span>
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-1">Your Session Co-Pilot</h3>
            <p className="text-white/70 text-sm max-w-xs">Prepare sessions, reflect on progress, draft notes, and explore therapeutic approaches with Sydney.</p>
          </div>
          <ChevronRight className="h-6 w-6 text-white/50 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Clients", val: "—", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Sessions Today", val: "—", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Group Sessions", val: "—", icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10" },
          { label: "Unread Messages", val: "—", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-display font-bold mb-0.5">{s.val}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "My Clients", icon: Users, action: () => setActiveView("patients"), gradient: "from-emerald-500 to-teal-500" },
          { label: "Today's Sessions", icon: Calendar, action: () => setActiveView("sessions"), gradient: "from-blue-500 to-cyan-500" },
          { label: "Session Notes", icon: FileText, action: () => setActiveView("notes"), gradient: "from-violet-500 to-purple-600" },
          { label: "Support Groups", icon: BookOpen, action: () => setActiveView("groups"), gradient: "from-amber-500 to-orange-500" },
          { label: "Messages", icon: MessageSquare, action: () => setActiveView("messages"), gradient: "from-rose-500 to-pink-500" },
          { label: "Ask Sydney", icon: Sparkles, action: () => setActiveView("sydney"), gradient: "from-teal-500 to-emerald-600" },
        ].map((a) => (
          <motion.button key={a.label} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={a.action}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 text-left">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
              <a.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium">{a.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold mb-4">Upcoming Sessions</h3>
        <div className="text-center py-6">
          <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No upcoming sessions scheduled</p>
        </div>
      </div>
    </div>
  );

  const views: Record<View, React.ReactNode> = {
    home: HomeView,
    sydney: (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-500" /> Sydney AI
          </h1>
          <p className="text-muted-foreground mt-1">Session co-pilot, note drafting, and therapeutic insights</p>
        </div>
        <SydneyAI isOpen={true} onClose={() => setActiveView("home")} inline />
      </div>
    ),
    patients: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">My Clients</h1><p className="text-muted-foreground mt-1">Manage your client roster</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No clients yet</h3>
          <p className="text-sm text-muted-foreground">Clients assigned to you will appear here</p>
        </div>
      </div>
    ),
    sessions: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Sessions</h1><p className="text-muted-foreground mt-1">Manage your therapy sessions</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No sessions scheduled</h3>
          <p className="text-sm text-muted-foreground">Your upcoming sessions will appear here</p>
        </div>
      </div>
    ),
    notes: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Session Notes</h1><p className="text-muted-foreground mt-1">Write and manage your session documentation</p></div>
        <ClinicalNoteEditor />
      </div>
    ),
    messages: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Messages</h1><p className="text-muted-foreground mt-1">Communicate with clients and colleagues</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No messages</h3>
          <p className="text-sm text-muted-foreground">Your conversations will appear here</p>
        </div>
      </div>
    ),
    groups: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Support Groups</h1><p className="text-muted-foreground mt-1">Manage your group therapy sessions</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No groups yet</h3>
          <p className="text-sm text-muted-foreground">Create a support group to get started</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <aside className="hidden lg:block lg:w-64 border-r border-border bg-card flex-shrink-0">
        <Sidebar {...sidebarProps} />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 lg:hidden">
              <Sidebar {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-5 py-4 bg-card/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors"><Menu className="h-5 w-5" /></button>
            <h2 className="text-sm font-semibold">{navItems.find(n => n.id === activeView)?.label ?? "Sydney AI"}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-xl transition-colors"><Bell className="h-4 w-4 text-muted-foreground" /></button>
            {activeView !== "sydney" ? (
              <button onClick={() => setSydneyOpen(prev => !prev)}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-200 ${sydneyOpen
                    ? "bg-gradient-to-r from-emerald-700 to-teal-700 shadow-[0_4px_16px_hsl(158_64%_35%/0.4)]"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_16px_hsl(158_64%_40%/0.3)] hover:opacity-95"
                  }`}>
                <Sparkles className="h-3.5 w-3.5" /> {sydneyOpen ? "Close Sydney" : "Sydney"}
              </button>
            ) : (
              <button onClick={() => setActiveView("home")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium hover:text-foreground transition-all">
                ← Back to Dashboard
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-5 py-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeView} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {views[activeView]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {activeView !== "sydney" && (
        <SydneyAI isOpen={sydneyOpen} onClose={() => setSydneyOpen(false)} />
      )}
    </div>
  );
};

export default TherapistDashboard;
