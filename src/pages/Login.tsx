import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, User, Stethoscope, HeartHandshake, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const roles = [
  {
    id: "patient",
    label: "I'm a Patient",
    desc: "Track mood, connect with my care team",
    icon: User,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/8 hover:bg-violet-500/14",
    border: "border-violet-500/30",
    activeBorder: "border-violet-500",
    activeRing: "ring-violet-500/20",
  },
  {
    id: "psychiatrist",
    label: "I'm a Psychiatrist",
    desc: "Diagnose, assess, and guide treatment",
    icon: Stethoscope,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/8 hover:bg-blue-500/14",
    border: "border-blue-500/30",
    activeBorder: "border-blue-500",
    activeRing: "ring-blue-500/20",
  },
  {
    id: "therapist",
    label: "I'm a Therapist",
    desc: "Conduct sessions and support clients",
    icon: HeartHandshake,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/8 hover:bg-emerald-500/14",
    border: "border-emerald-500/30",
    activeBorder: "border-emerald-500",
    activeRing: "ring-emerald-500/20",
  },
];

const Login = () => {
  const [role, setRole] = useState<string | null>(null);
  const { login } = useKindeAuth();

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between overflow-hidden">
        {/* Orbs */}
        <div className="orb w-80 h-80 bg-white/10 -top-20 -right-20" />
        <div className="orb w-60 h-60 bg-violet-300/20 bottom-10 left-10" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <Heart className="h-7 w-7 text-white" strokeWidth={1.5} />
          <span className="font-display font-bold text-xl text-white">TherapEASE</span>
        </Link>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
              Your wellness journey
              <br />
              <span className="italic text-white/80">starts here.</span>
            </h2>
            <p className="text-white/65 leading-relaxed mb-8">
              Connect with your care team, track emotional patterns, and access your AI companion — all from one secure platform.
            </p>

            {/* Floating stat cards */}
            <div className="space-y-3">
              {[
                { emoji: "💜", val: "98%", label: "Patient satisfaction" },
                { emoji: "🔒", val: "HIPAA", label: "Compliant & secure" },
                { emoji: "⚡", val: "24/7", label: "AI companion available" },
              ].map((s, i) => (
                <motion.div
                  key={s.val}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15"
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-white font-bold text-sm">{s.val}</span>
                  <span className="text-white/60 text-sm">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        {/* Background orbs */}
        <div className="orb w-80 h-80 bg-primary/5 top-0 right-0" />
        <div className="orb w-60 h-60 bg-violet-400/5 bottom-20 left-0" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <Heart className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <span className="font-display font-bold text-xl">TherapEASE</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Select your role to continue</p>
          </div>

          <div className="space-y-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${role === r.id
                    ? `${r.activeBorder} ring-4 ${r.activeRing} bg-card shadow-card`
                    : `border-border ${r.bg} hover:border-muted-foreground/30`
                  }`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-md flex-shrink-0 transition-transform duration-200 ${role === r.id ? "scale-110" : ""}`}>
                  <r.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.desc}</div>
                </div>
                {role === r.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={() => {
              if (role) localStorage.setItem("user_role", role);
              login();
            }}
            disabled={!role}
            className="w-full h-14 rounded-2xl bg-gradient-hero text-base font-semibold shadow-glow-sm hover:shadow-glow hover:opacity-95 transition-all duration-300 group disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Continue with Kinde
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
