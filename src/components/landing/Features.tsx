import { motion } from "framer-motion";
import { MessageSquare, Heart, TrendingUp, Shield, Brain, CalendarDays } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Companion",
    description: "Meet Ease — your emotionally intelligent AI that listens for subtext, validates feelings, and guides you through difficult moments 24/7.",
    gradient: "from-violet-500/10 to-purple-500/5",
    iconBg: "from-violet-500 to-purple-600",
    tag: "Always Available",
  },
  {
    icon: Heart,
    title: "Adaptive Check-ins",
    description: "Daily mood tracking that adapts to your patterns. The more you log, the smarter your insights become.",
    gradient: "from-rose-500/10 to-pink-500/5",
    iconBg: "from-rose-500 to-pink-500",
    tag: "Daily Habit",
  },
  {
    icon: TrendingUp,
    title: "Pattern Analytics",
    description: "Visualise mood, stress, energy, and sleep trends over weeks and months. Understand the 'why' behind how you feel.",
    gradient: "from-blue-500/10 to-cyan-500/5",
    iconBg: "from-blue-500 to-cyan-500",
    tag: "Evidence-Based",
  },
  {
    icon: CalendarDays,
    title: "Session Management",
    description: "Book, reschedule, and attend therapy sessions seamlessly. Integrated notes and homework tracking keep everyone on the same page.",
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconBg: "from-emerald-500 to-teal-500",
    tag: "Seamless Scheduling",
  },
  {
    icon: MessageSquare,
    title: "Clinical Tools",
    description: "PHQ-9, GAD-7 assessments. Clinical notes. Risk alerts. Referral management. Everything professionals need, beautifully integrated.",
    gradient: "from-orange-500/10 to-amber-500/5",
    iconBg: "from-orange-500 to-amber-400",
    tag: "For Professionals",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your data is encrypted, HIPAA-aligned, and fully consent-based. You choose who sees what, and when.",
    gradient: "from-indigo-500/10 to-violet-500/5",
    iconBg: "from-indigo-500 to-violet-500",
    tag: "Enterprise Security",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-surface-warm relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-primary/5 -top-40 -left-40" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-primary/15">
            Platform Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-5 leading-tight">
            Everything you need,{" "}
            <span className="text-gradient-primary italic">nothing you don't</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Built with input from patients, psychiatrists, and therapists to solve real problems.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group relative bg-gradient-to-br ${f.gradient} bg-card border border-border rounded-2xl p-7 hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 overflow-hidden`}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.03] to-transparent rounded-2xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center shadow-lg`}>
                    <f.icon className="h-5.5 w-5.5 text-white" strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
