import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, ClipboardList, FileText, MessageSquare, AlertTriangle, Settings, LogOut, BarChart3, Stethoscope, Send } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: Users, label: "Patients" },
  { icon: ClipboardList, label: "Assessments" },
  { icon: FileText, label: "Clinical Notes" },
  { icon: Send, label: "Referrals" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

const PsychiatristDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border p-4">
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <Heart className="h-7 w-7 text-primary" strokeWidth={1.5} />
          <span className="font-display font-bold text-lg">TherapEASE</span>
        </Link>
        <div className="px-3 py-1.5 mb-4 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground text-center">
          Psychiatrist Portal
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
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
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold mb-1">Dr. James Chen 🩺</h1>
            <p className="text-muted-foreground">Clinical overview and patient management</p>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">2 Risk Alerts</div>
              <div className="text-sm text-muted-foreground">Sarah M. reported severe mood drop. John D. missed 3 check-ins.</div>
            </div>
            <Button variant="outline" size="sm" className="ml-auto flex-shrink-0">Review</Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Active Patients", value: "24" },
              { label: "Pending Tests", value: "7" },
              { label: "Today's Sessions", value: "5" },
              { label: "Unread Messages", value: "12" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl p-5 shadow-card border border-border">
                <div className="text-sm text-muted-foreground mb-1">{s.label}</div>
                <div className="text-2xl font-display font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Recent Patients</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Mood Trend</th>
                    <th className="pb-3 font-medium">Last Check-in</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: "Sarah M.", mood: "↗ Improving", checkin: "Today", status: "Active", statusColor: "text-success" },
                    { name: "John D.", mood: "↘ Declining", checkin: "3 days ago", status: "At Risk", statusColor: "text-destructive" },
                    { name: "Lisa K.", mood: "→ Stable", checkin: "Yesterday", status: "Active", statusColor: "text-success" },
                    { name: "Mike R.", mood: "↗ Improving", checkin: "Today", status: "New", statusColor: "text-info" },
                  ].map((p) => (
                    <tr key={p.name} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3">{p.mood}</td>
                      <td className="py-3 text-muted-foreground">{p.checkin}</td>
                      <td className={`py-3 font-medium ${p.statusColor}`}>{p.status}</td>
                      <td className="py-3"><Button variant="ghost" size="sm">View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: ClipboardList, label: "Create Assessment", desc: "Build custom psychological tests" },
              { icon: FileText, label: "Add Clinical Note", desc: "Document patient progress" },
              { icon: Send, label: "Make Referral", desc: "Refer patient to a therapist" },
            ].map((a) => (
              <button key={a.label} className="bg-card rounded-xl p-5 shadow-card border border-border text-left hover:shadow-card-hover hover:border-primary/30 transition-all">
                <a.icon className="h-6 w-6 text-primary mb-3" />
                <div className="font-display font-semibold text-sm mb-1">{a.label}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PsychiatristDashboard;
