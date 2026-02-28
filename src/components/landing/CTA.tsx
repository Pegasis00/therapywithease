import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(145_35%_45%_/_0.3),_transparent_70%)]" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Transform Mental Health Care?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Join thousands of patients and professionals using TherapEASE for better outcomes.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90 text-base px-8 py-6 shadow-lg"
            >
              Get Started Free <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
