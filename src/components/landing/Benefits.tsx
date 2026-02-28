import { motion } from "framer-motion";
import { Lock, TrendingUp, Clock, Shield, Smartphone, HeartHandshake } from "lucide-react";

const benefits = [
  { icon: Lock, title: "Consent-Based Data Sharing", desc: "Patients control who sees their data. Every access is explicit and logged." },
  { icon: TrendingUp, title: "Long-Term Progress Tracking", desc: "Mood trends, stress patterns, and emotional growth visualized over weeks and months." },
  { icon: Clock, title: "24/7 AI Companion", desc: "An always-available emotional support chatbot for moments when you need someone to talk to." },
  { icon: Shield, title: "Secure & Compliant", desc: "Built with healthcare-grade security. Your mental health data is encrypted and protected." },
  { icon: Smartphone, title: "Accessible Anywhere", desc: "Fully responsive design works on desktop, tablet, and mobile devices." },
  { icon: HeartHandshake, title: "Collaborative Care", desc: "Psychiatrists and therapists work together, sharing insights for holistic treatment." },
];

const Benefits = () => {
  return (
    <section className="py-24 bg-gradient-hero-subtle">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Why Choose TherapEASE?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A platform designed with empathy, security, and clinical excellence in mind.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-5 rounded-xl bg-card/80 backdrop-blur-sm border border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
