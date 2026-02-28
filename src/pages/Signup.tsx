import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, ArrowLeft, User, Stethoscope, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  { id: "patient", label: "Patient", icon: User, desc: "Track mood, connect with professionals" },
  { id: "psychiatrist", label: "Psychiatrist", icon: Stethoscope, desc: "Diagnose, assess, and guide treatment" },
  { id: "therapist", label: "Therapist", icon: HeartHandshake, desc: "Conduct sessions, manage therapy" },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "patient") navigate("/patient");
    else if (role === "psychiatrist") navigate("/psychiatrist");
    else if (role === "therapist") navigate("/therapist");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl">TherapEASE</span>
          </Link>
          <h1 className="text-2xl font-display font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join TherapEASE and start your journey</p>
        </div>

        <form onSubmit={handleSignup} className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-5">
          <div>
            <Label className="mb-2 block">Select Your Role</Label>
            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    role === r.id
                      ? "bg-secondary border-primary ring-2 ring-primary/20"
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role === r.id ? "bg-gradient-hero" : "bg-muted"
                  }`}>
                    <r.icon className={`h-5 w-5 ${role === r.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Smith" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" required />
          </div>

          <Button type="submit" variant="hero" className="w-full py-5" disabled={!role}>
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
          </p>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
