import { Link } from "react-router-dom";
import { Heart, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
                <Heart className="relative h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
              <span className="font-display font-bold text-xl">
                Therap<span className="text-gradient-primary">EASE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Professional mental health care, made accessible, secure, and human. For patients and professionals alike.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {[
            {
              title: "Platform",
              links: [
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Pricing", href: "#" },
              ],
            },
            {
              title: "Portals",
              links: [
                { label: "Patient Portal", href: "/login" },
                { label: "Psychiatrist Portal", href: "/login" },
                { label: "Therapist Portal", href: "/login" },
                { label: "Sign Up", href: "/signup" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "HIPAA Compliance", href: "#" },
                { label: "Cookie Policy", href: "#" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm mb-4 text-foreground">{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map((l) => (
                  l.href.startsWith("/") ? (
                    <Link key={l.label} to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {l.label}
                    </Link>
                  ) : (
                    <a key={l.label} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {l.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 TherapEASE. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for better mental health
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
