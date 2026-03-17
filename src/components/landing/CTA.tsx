import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(290_70%_70%_/_0.4),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(240_70%_60%_/_0.3),_transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Start Your Journey Today
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Ready to take the{" "}
            <br className="hidden sm:block" />
            <span className="italic text-white/90">first step?</span>
          </h2>

          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of patients and professionals building better mental health outcomes with TherapEASE.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="text-base px-10 py-6 rounded-full bg-white text-purple-700 hover:bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_60px_rgba(0,0,0,0.3)] transition-all duration-300 font-semibold group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-10 py-6 rounded-full border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                I Already Have an Account
              </Button>
            </Link>
          </div>

          <p className="text-white/50 text-xs mt-8">
            No credit card required · Cancel anytime · HIPAA-aligned
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
