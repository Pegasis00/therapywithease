import { motion } from "framer-motion";
import { UserPlus, Search, CalendarCheck, TrendingUp } from "lucide-react";

const steps = [
  { icon: UserPlus, num: "01", title: "Sign Up & Choose Your Role", desc: "Register as a Patient, Psychiatrist, or Therapist. Your personalised dashboard is ready instantly.", color: "from-violet-500 to-purple-600" },
  { icon: Search, num: "02", title: "Connect with Professionals", desc: "Patients find verified psychiatrists and therapists. Professionals onboard their patients effortlessly.", color: "from-blue-500 to-cyan-500" },
  { icon: CalendarCheck, num: "03", title: "Book & Attend Sessions", desc: "Schedule appointments, join secure video sessions, and manage the full treatment journey.", color: "from-emerald-500 to-teal-500" },
  { icon: TrendingUp, num: "04", title: "Track Progress & Heal", desc: "Monitor mood trends, complete assessments, and watch your emotional wellbeing improve over time.", color: "from-orange-500 to-amber-500" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      {/* Section BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-primary/15">
            Simple Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-5 leading-tight">
            How <span className="text-gradient-primary italic">TherapEASE</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Four simple steps to better mental health care — for patients and professionals alike.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
          {/* Connector line */}
          <div className="absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-400/30 via-blue-400/30 via-emerald-400/30 to-amber-400/30 hidden lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-card-hover transition-all duration-300 hover:border-primary/20">
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative z-10`}>
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-4xl font-display font-bold text-muted-foreground/15 group-hover:text-muted-foreground/25 transition-colors">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base mb-2 leading-snug">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
