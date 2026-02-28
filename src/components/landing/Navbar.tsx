import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">TherapEASE</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
          <Link to="/signup"><Button variant="hero" size="sm">Get Started</Button></Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="flex flex-col gap-3 p-4">
              <a href="#how-it-works" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>How It Works</a>
              <a href="#features" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Features</a>
              <a href="#testimonials" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Testimonials</a>
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="ghost" className="w-full">Log In</Button></Link>
              <Link to="/signup" onClick={() => setOpen(false)}><Button variant="hero" className="w-full">Get Started</Button></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
