import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Brain } from "lucide-react";

const floatingCards = [
  { icon: "😊", label: "Mood: Great", sub: "Just now", color: "from-green-400/20 to-emerald-400/10", delay: 0 },
  { icon: "🧠", label: "PHQ-9 Score", sub: "Minimal — 4/27", color: "from-purple-400/20 to-violet-400/10", delay: 0.3 },
  { icon: "📅", label: "Session Today", sub: "3:00 PM with Dr. Chen", color: "from-blue-400/20 to-cyan-400/10", delay: 0.6 },
];

const trust = [
  { icon: Brain, label: "AI-Powered" },
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Sparkles, label: "Clinically Backed" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-purple-400/20 -top-40 -right-40" />
      <div className="orb w-[400px] h-[400px] bg-violet-400/15 bottom-0 -left-20" />
      <div className="orb w-[300px] h-[300px] bg-indigo-400/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(hsl(262 68% 58%) 1px, transparent 1px), linear-gradient(90deg, hsl(262 68% 58%) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-64px)] py-20">

          {/* Left — copy */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Mental Health Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.08] mb-6 text-foreground"
            >
              Your mind
              <br />
              deserves{" "}
              <span className="text-gradient-primary italic">ease</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md"
            >
              Connect with psychiatrists and therapists, track your emotional patterns daily, and chat with your AI companion — all in one secure platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 rounded-full bg-gradient-hero shadow-glow hover:shadow-[0_0_60px_hsl(262_68%_58%/0.35)] hover:opacity-95 transition-all duration-300 group"
                >
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 rounded-full border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  See How It Works
                </Button>
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6"
            >
              {trust.map((t) => (
                <div key={t.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <t.icon className="h-3.5 w-3.5 text-primary" />
                  <span>{t.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating UI cards */}
          <div className="relative hidden lg:flex flex-col items-center justify-center gap-0 h-[540px]">
            {/* Main card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_80px_hsl(262_68%_58%/0.15)] rounded-[2rem] p-6 animate-float"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow-sm">
                  <span className="text-lg">💜</span>
                </div>
                <div>
                  <div className="font-display font-semibold text-sm">TherapEASE</div>
                  <div className="text-xs text-muted-foreground">Your wellness dashboard</div>
                </div>
              </div>

              {/* Mood bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Weekly mood trend</span>
                  <span className="text-green-500 font-medium">↗ Improving</span>
                </div>
                <div className="flex gap-1 items-end h-12">
                  {[60, 45, 70, 55, 80, 72, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.6 + i * 0.07 }}
                      className="flex-1 rounded-sm"
                      style={{ background: i === 6 ? "hsl(262 68% 58%)" : `hsl(262 68% 58% / ${0.2 + i * 0.08})` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d) => <span key={d}>{d}</span>)}
                </div>
              </div>

              {/* Mini check-ins */}
              <div className="space-y-2">
                {["Anxiety decreased 40%", "3 sessions completed", "PHQ-9: Mild → Minimal"].map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    <span className="text-foreground/70">{line}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating notification cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
                className="absolute"
                style={{
                  top: `${i * 38 + 8}%`,
                  right: i % 2 === 0 ? "-60px" : "auto",
                  left: i % 2 !== 0 ? "-60px" : "auto",
                }}
              >
                <div className={`flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-card border border-white rounded-2xl px-4 py-2.5 min-w-[180px] animate-float`}
                  style={{ animationDelay: `${card.delay}s` }}>
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <div className="text-xs font-semibold">{card.label}</div>
                    <div className="text-[10px] text-muted-foreground">{card.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
