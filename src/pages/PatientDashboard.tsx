import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Heart, MessageSquare, BarChart3, ClipboardList, Users, CalendarDays, Settings, LogOut, Smile, Meh, Frown } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: Heart, label: "Mood Check-in" },
  { icon: MessageSquare, label: "AI Companion" },
  { icon: BarChart3, label: "Insights" },
  { icon: ClipboardList, label: "Tests" },
  { icon: CalendarDays, label: "Appointments" },
  { icon: Users, label: "Support Groups" },
  { icon: Settings, label: "Settings" },
];

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border p-4">
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">TherapEASE</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                item.active
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <Link to="/">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold mb-1">Good Morning, Sarah 👋</h1>
            <p className="text-muted-foreground">Here's your mental health overview for today.</p>
          </div>

          {/* Quick Mood */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
            <h3 className="font-display font-semibold mb-4">How are you feeling right now?</h3>
            <div className="flex gap-4">
              {[
                { icon: Smile, label: "Great", color: "text-success" },
                { icon: Meh, label: "Okay", color: "text-warning" },
                { icon: Frown, label: "Not Good", color: "text-destructive" },
              ].map((mood) => (
                <button key={mood.label} className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary transition-all">
                  <mood.icon className={`h-8 w-8 ${mood.color}`} />
                  <span className="text-sm">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Mood Streak", value: "12 days", sub: "Consistent tracking" },
              { label: "Next Appointment", value: "Mar 3", sub: "Dr. Chen - Psychiatry" },
              { label: "Tests Pending", value: "2", sub: "PHQ-9, GAD-7" },
              { label: "Group Sessions", value: "3 active", sub: "Weekly groups" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card border border-border">
                <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-xl font-display font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { text: "Completed daily mood check-in", time: "Today, 9:00 AM", icon: Heart },
                  { text: "AI Companion session", time: "Yesterday, 8:30 PM", icon: MessageSquare },
                  { text: "PHQ-9 test completed", time: "Feb 26", icon: ClipboardList },
                  { text: "Therapy session with Emily R.", time: "Feb 25", icon: CalendarDays },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <a.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{a.text}</div>
                      <div className="text-xs text-muted-foreground">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Team */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold mb-4">Your Care Team</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold">JC</div>
                  <div className="flex-1">
                    <div className="font-medium">Dr. James Chen</div>
                    <div className="text-sm text-muted-foreground">Psychiatrist</div>
                  </div>
                  <Button variant="outline" size="sm">Message</Button>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold">ER</div>
                  <div className="flex-1">
                    <div className="font-medium">Emily R., LMFT</div>
                    <div className="text-sm text-muted-foreground">Therapist</div>
                  </div>
                  <Button variant="outline" size="sm">Message</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PatientDashboard;
