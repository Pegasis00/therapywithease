import { motion } from "framer-motion";
import { UserPlus, Search, CalendarCheck, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up & Choose Your Role",
    description: "Register as a Patient, Psychiatrist, or Therapist. Your personalized dashboard awaits.",
  },
  {
    icon: Search,
    title: "Connect with Professionals",
    description: "Patients find and connect with verified psychiatrists and therapists based on their needs.",
  },
  {
    icon: CalendarCheck,
    title: "Book & Attend Sessions",
    description: "Schedule appointments, attend online sessions, and manage your treatment seamlessly.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress & Heal",
    description: "Monitor mood trends, complete assessments, and see your emotional growth over time.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-surface-warm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            How TherapEASE Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A simple, structured path to better mental health care
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-5">
                <step.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute top-7 left-[60%] right-0 h-px bg-border hidden md:block last:hidden" />
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <div className="mt-3 text-xs font-medium text-primary">Step {i + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
