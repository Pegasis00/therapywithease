import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">TherapEASE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional mental health care, made accessible and secure.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Platform</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">For Users</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Patient Portal</span>
              <span>Psychiatrist Portal</span>
              <span>Therapist Portal</span>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>HIPAA Compliance</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 TherapEASE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
