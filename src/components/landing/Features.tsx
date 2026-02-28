import { motion } from "framer-motion";
import {
  Heart, Brain, BarChart3, ClipboardList, Users, MessageSquare,
  FileText, Stethoscope, CalendarDays
} from "lucide-react";

const roleFeatures = [
  {
    role: "For Patients",
    description: "Take control of your mental health journey with powerful self-care tools.",
    features: [
      { icon: Heart, label: "Daily Mood Check-ins" },
      { icon: Brain, label: "AI Emotional Companion" },
      { icon: BarChart3, label: "Insights Dashboard" },
      { icon: ClipboardList, label: "Psychological Tests" },
      { icon: Users, label: "Support Groups" },
      { icon: CalendarDays, label: "Appointment Booking" },
    ],
    accent: "from-primary to-accent",
  },
  {
    role: "For Psychiatrists",
    description: "Comprehensive clinical tools to diagnose, assess, and guide treatment.",
    features: [
      { icon: FileText, label: "Patient Data Access" },
      { icon: ClipboardList, label: "Test Management" },
      { icon: Stethoscope, label: "Clinical Notes" },
      { icon: MessageSquare, label: "Secure Messaging" },
      { icon: Brain, label: "AI Summaries" },
      { icon: Users, label: "Referral System" },
    ],
    accent: "from-info to-primary",
  },
  {
    role: "For Therapists",
    description: "Streamlined therapy management with patient collaboration tools.",
    features: [
      { icon: CalendarDays, label: "Session Scheduling" },
      { icon: MessageSquare, label: "Chat & Video Sessions" },
      { icon: FileText, label: "Session Notes" },
      { icon: Users, label: "Group Management" },
      { icon: BarChart3, label: "Patient Overview" },
      { icon: ClipboardList, label: "Homework Assignment" },
    ],
    accent: "from-accent to-success",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Powerful Features for Every Role
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're seeking care or providing it, TherapEASE has the tools you need.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {roleFeatures.map((role, i) => (
            <motion.div
              key={role.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border"
            >
              <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${role.accent} text-primary-foreground text-sm font-medium mb-4`}>
                {role.role}
              </div>
              <p className="text-muted-foreground mb-6">{role.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {role.features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2 text-sm">
                    <f.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
