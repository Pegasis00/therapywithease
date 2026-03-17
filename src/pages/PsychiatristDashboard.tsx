import { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useProfile } from "@/hooks/useProfile";
import { ClinicalNoteEditor } from "@/components/dashboard/ClinicalNoteEditor";
import { SydneyAI } from "@/components/dashboard/SydneyAI";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Home, Users, ClipboardList, FileText, ArrowRightLeft,
  MessageSquare, Menu, Bell, Brain, Calendar, Stethoscope, ChevronRight
} from "lucide-react";

type View = "home" | "patients" | "assessments" | "notes" | "referrals" | "messages" | "sydney";

const navItems = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "patients", label: "My Patients", icon: Users },
  { id: "assessments", label: "Assessments", icon: ClipboardList },
  { id: "notes", label: "Clinical Notes", icon: FileText },
  { id: "referrals", label: "Referrals", icon: ArrowRightLeft },
  { id: "messages", label: "Messages", icon: MessageSquare },
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
          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-sm" />
          <Stethoscope className="relative h-6 w-6 text-blue-500" strokeWidth={1.5} />
        </div>
        <div>
          <span className="font-display font-bold text-base block">TherapEASE</span>
          <span className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">Psychiatrist</span>
        </div>
      </div>
    </div>

    <div className="mx-3 mt-4 mb-2">
      <button
        onClick={() => { setActiveView("sydney"); setSidebarOpen(false); }}
        className="w-full relative overflow-hidden rounded-2xl p-3.5 text-left group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-90 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-xs">Sydney AI Assistant</div>
            <div className="text-white/70 text-[10px]">Clinical insights & support</div>
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive ? "bg-blue-500/10 text-blue-600 font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
            <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-blue-600" : ""}`} />
            {item.label}
          </button>
        );
      })}
    </nav>

    <div className="mt-auto p-3 border-t border-border/50">
      <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {firstName[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{profileName || `Dr. ${firstName}`}</div>
          <div className="text-xs text-muted-foreground">Psychiatrist</div>
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
const PsychiatristDashboard = () => {
  const { logout } = useKindeAuth();
  const { data: profile } = useProfile();
  const [activeView, setActiveView] = useState<View>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sydneyOpen, setSydneyOpen] = useState(false);

  const firstName = profile?.full_name?.split(" ")[0] || "Doctor";

  const sidebarProps: SidebarProps = {
    activeView, setActiveView, setSidebarOpen, firstName,
    profileName: profile?.full_name,
    onLogout: () => logout({ redirectUrl: window.location.origin }),
  };

  const HomeView = (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Welcome, Dr. {firstName} 👨‍⚕️</h1>
        <p className="text-muted-foreground mt-1">Here's your clinical overview for today</p>
      </div>

      <motion.div whileHover={{ y: -2 }} onClick={() => setActiveView("sydney")}
        className="relative overflow-hidden rounded-2xl cursor-pointer group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_hsl(200_80%_70%/0.4),_transparent_60%)]" />
        <div className="orb w-32 h-32 bg-white/10 -top-8 right-16" />
        <div className="relative z-10 flex items-center justify-between p-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-white" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-xs font-medium">Sydney AI</span>
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-1">Clinical AI Assistant</h3>
            <p className="text-white/70 text-sm max-w-xs">Analyse patient patterns, draft clinical notes, and get evidence-based insights instantly.</p>
          </div>
          <ChevronRight className="h-6 w-6 text-white/50 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Patients", val: "—", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Today's Sessions", val: "—", icon: Calendar, color: "text-violet-500", bg: "bg-violet-500/10" },
          { label: "Pending Reviews", val: "—", icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Referrals Sent", val: "—", icon: ArrowRightLeft, color: "text-emerald-500", bg: "bg-emerald-500/10" },
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
          { label: "View Patients", icon: Users, action: () => setActiveView("patients"), gradient: "from-blue-500 to-cyan-500" },
          { label: "Write Clinical Note", icon: FileText, action: () => setActiveView("notes"), gradient: "from-violet-500 to-purple-600" },
          { label: "See Assessments", icon: ClipboardList, action: () => setActiveView("assessments"), gradient: "from-emerald-500 to-teal-500" },
          { label: "Manage Referrals", icon: ArrowRightLeft, action: () => setActiveView("referrals"), gradient: "from-amber-500 to-orange-500" },
          { label: "Messages", icon: MessageSquare, action: () => setActiveView("messages"), gradient: "from-rose-500 to-pink-500" },
          { label: "Ask Sydney", icon: Brain, action: () => setActiveView("sydney"), gradient: "from-indigo-500 to-blue-600" },
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
    </div>
  );

  const views: Record<View, React.ReactNode> = {
    home: HomeView,
    sydney: (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-500" /> Sydney AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">Clinical support, pattern analysis, and documentation help</p>
        </div>
        <SydneyAI isOpen={true} onClose={() => setActiveView("home")} inline />
      </div>
    ),
    patients: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">My Patients</h1><p className="text-muted-foreground mt-1">Manage and review your patient list</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No patients yet</h3>
          <p className="text-sm text-muted-foreground">Patients assigned to you will appear here</p>
        </div>
      </div>
    ),
    assessments: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Assessments</h1><p className="text-muted-foreground mt-1">Review PHQ-9, GAD-7 results from your patients</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No assessment data yet</h3>
          <p className="text-sm text-muted-foreground">Patient assessments will appear here as they complete them</p>
        </div>
      </div>
    ),
    notes: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Clinical Notes</h1><p className="text-muted-foreground mt-1">Write and manage your clinical documentation</p></div>
        <ClinicalNoteEditor />
      </div>
    ),
    referrals: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Referrals</h1><p className="text-muted-foreground mt-1">Manage patient referrals</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <ArrowRightLeft className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No referrals</h3>
          <p className="text-sm text-muted-foreground">Referrals you send or receive will appear here</p>
        </div>
      </div>
    ),
    messages: (
      <div className="space-y-4">
        <div><h1 className="text-2xl font-display font-bold">Messages</h1><p className="text-muted-foreground mt-1">Secure communication with patients and colleagues</p></div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">No messages yet</h3>
          <p className="text-sm text-muted-foreground">Your conversations will appear here</p>
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
                    ? "bg-gradient-to-r from-blue-700 to-cyan-700 shadow-[0_4px_16px_hsl(210_70%_55%/0.4)]"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_4px_16px_hsl(210_70%_55%/0.3)] hover:opacity-95"
                  }`}>
                <Brain className="h-3.5 w-3.5" /> {sydneyOpen ? "Close Sydney" : "Sydney"}
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

export default PsychiatristDashboard;
