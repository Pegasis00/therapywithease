import { motion } from "framer-motion";
import { Lock, TrendingUp, Clock, Shield, Smartphone, HeartHandshake } from "lucide-react";

const benefits = [
  { icon: Lock, title: "Consent-Based Sharing", desc: "Every data access is explicit and logged. Your records belong to you, always.", color: "text-violet-500", bg: "bg-violet-500/10" },
  { icon: TrendingUp, title: "Long-Term Trend Tracking", desc: "Weeks of mood, stress, and sleep data visualised into clear, actionable insights.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Clock, title: "24/7 AI Support", desc: "An always-on companion for moments when you need to talk but can't reach someone.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Shield, title: "Healthcare-Grade Security", desc: "End-to-end encryption, HIPAA-aligned architecture, and regular third-party audits.", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Smartphone, title: "Works Everywhere", desc: "Fully responsive across desktop, tablet, and mobile — no app download needed.", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: HeartHandshake, title: "Collaborative Care", desc: "Psychiatrists and therapists share insights and co-ordinate treatment in real time.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

const Benefits = () => {
  return (
    <section className="py-32 bg-surface-warm relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-blue-400/8 top-0 right-0" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-primary/15">
            Why TherapEASE
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-5 leading-tight">
            Designed with{" "}
            <span className="text-gradient-warm italic">empathy first</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Every feature was built to make mental health care more humane, effective, and accessible.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group flex gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl ${b.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <b.icon className={`h-5 w-5 ${b.color}`} />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-1.5 text-sm">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
