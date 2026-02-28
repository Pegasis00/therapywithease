import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, CalendarDays, MessageSquare, FileText, Settings, LogOut, BarChart3, Clock, Bell } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: Users, label: "Patients" },
  { icon: CalendarDays, label: "Sessions" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Users, label: "Support Groups" },
  { icon: FileText, label: "Notes" },
  { icon: Settings, label: "Settings" },
];

const TherapistDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border p-4">
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <Heart className="h-7 w-7 text-primary" strokeWidth={1.5} />
          <span className="font-display font-bold text-lg">TherapEASE</span>
        </Link>
        <div className="px-3 py-1.5 mb-4 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground text-center">
          Therapist Portal
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item, i) => (
            <button
              key={`${item.label}-${i}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                item.active ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
        <Link to="/">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </Link>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold mb-1">Emily R., LMFT 💜</h1>
              <p className="text-muted-foreground">Your therapy practice at a glance</p>
            </div>
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">3</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Assigned Patients", value: "18" },
              { label: "Today's Sessions", value: "4" },
              { label: "This Week", value: "16 sessions" },
              { label: "Groups Managed", value: "3" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl p-5 shadow-card border border-border">
                <div className="text-sm text-muted-foreground mb-1">{s.label}</div>
                <div className="text-2xl font-display font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
            <h3 className="font-display font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {[
                { time: "9:00 AM", patient: "Sarah M.", type: "Individual Therapy", status: "Completed" },
                { time: "10:30 AM", patient: "John D.", type: "CBT Session", status: "Completed" },
                { time: "1:00 PM", patient: "Anxiety Support Group", type: "Group Session", status: "In 2 hours" },
                { time: "3:00 PM", patient: "Lisa K.", type: "Follow-up", status: "Upcoming" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="w-16 text-center flex-shrink-0">
                    <div className="text-sm font-medium">{s.time}</div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.patient}</div>
                    <div className="text-xs text-muted-foreground">{s.type}</div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    s.status === "Completed" ? "bg-secondary text-secondary-foreground" :
                    s.status.includes("hours") ? "bg-warning/10 text-warning" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold mb-4">Your Support Groups</h3>
              <div className="space-y-3">
                {[
                  { name: "Anxiety & Stress Relief", members: 8, next: "Today, 1 PM" },
                  { name: "Depression Support Circle", members: 6, next: "Tomorrow, 4 PM" },
                  { name: "Grief Processing", members: 5, next: "Friday, 2 PM" },
                ].map((g) => (
                  <div key={g.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="text-sm font-medium">{g.name}</div>
                      <div className="text-xs text-muted-foreground">{g.members} members · Next: {g.next}</div>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: CalendarDays, label: "Schedule Session" },
                  { icon: FileText, label: "Add Session Note" },
                  { icon: Users, label: "Create Group" },
                  { icon: Clock, label: "View History" },
                ].map((a) => (
                  <button key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary transition-all">
                    <a.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TherapistDashboard;
