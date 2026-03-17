import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, User, Stethoscope, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const roles = [
  {
    id: "patient",
    label: "Patient",
    desc: "Track mood, access therapy, chat with AI",
    icon: User,
    emoji: "🧘",
    gradient: "from-violet-500 to-purple-600",
    activeBorder: "border-violet-500",
    activeRing: "ring-violet-500/20",
    perks: ["Mood & wellness tracking", "Book sessions", "AI companion"],
  },
  {
    id: "psychiatrist",
    label: "Psychiatrist",
    desc: "Clinical tools, assessments, patient management",
    icon: Stethoscope,
    emoji: "🩺",
    gradient: "from-blue-500 to-cyan-500",
    activeBorder: "border-blue-500",
    activeRing: "ring-blue-500/20",
    perks: ["Patient dashboards", "PHQ-9 & GAD-7 tools", "Referral management"],
  },
  {
    id: "therapist",
    label: "Therapist",
    desc: "Session management, group therapy, notes",
    icon: HeartHandshake,
    emoji: "💬",
    gradient: "from-emerald-500 to-teal-500",
    activeBorder: "border-emerald-500",
    activeRing: "ring-emerald-500/20",
    perks: ["Session scheduling", "Group management", "Clinical notes"],
  },
];

const Signup = () => {
  const [role, setRole] = useState<string | null>(null);
  const { register } = useKindeAuth();

  const selectedRole = roles.find((r) => r.id === role);

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-12 flex-col justify-between overflow-hidden">
        <div className="orb w-80 h-80 bg-white/10 -top-20 -left-20" />
        <div className="orb w-60 h-60 bg-emerald-300/20 bottom-0 right-0" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <Heart className="h-7 w-7 text-white" strokeWidth={1.5} />
          <span className="font-display font-bold text-xl text-white">TherapEASE</span>
        </Link>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
              Join thousands
              <br />
              <span className="italic text-white/80">healing together.</span>
            </h2>
            <p className="text-white/65 leading-relaxed mb-8">
              Whether you're seeking support or providing it — TherapEASE gives you the tools to make it meaningful.
            </p>

            {selectedRole ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/15 rounded-2xl p-5 border border-white/20 backdrop-blur-sm"
              >
                <div className="text-white font-display font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">{selectedRole.emoji}</span>
                  As a {selectedRole.label}, you'll get:
                </div>
                <div className="space-y-2">
                  {selectedRole.perks.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-white/80 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15 backdrop-blur-sm">
                <p className="text-white/60 text-sm">Select a role on the right to see what's included →</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="orb w-80 h-80 bg-emerald-400/5 top-0 right-0" />
        <div className="orb w-60 h-60 bg-teal-400/5 bottom-20 left-0" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <span className="font-display font-bold text-xl">TherapEASE</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">Choose your role to get started</p>
          </div>

          <div className="space-y-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${role === r.id
                    ? `${r.activeBorder} ring-4 ${r.activeRing} bg-card shadow-card`
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-md flex-shrink-0 transition-all duration-200 ${role === r.id ? "scale-110 shadow-lg" : ""}`}>
                  <span className="text-xl">{r.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{r.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.desc}</div>
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
              register();
            }}
            disabled={!role}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-base font-semibold shadow-[0_0_24px_hsl(158_64%_40%/0.25)] hover:shadow-[0_0_40px_hsl(158_64%_40%/0.35)] hover:opacity-95 transition-all duration-300 group disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Sign Up with Kinde
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
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

export default Signup;
