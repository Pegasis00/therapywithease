import { motion } from "framer-motion";
import { MessageSquare, Heart, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Companion",
    description: "Not just a chatbot. Meet your clinical-grade companion that listens for subtext and uncovers hidden emotional patterns.",
  },
  {
    icon: Heart,
    title: "Adaptive Check-ins",
    description: "Answer daily questions that adapt to your patterns and mental health journey.",
  },
  {
    icon: TrendingUp,
    title: "Pattern Tracking",
    description: "Visualize mood, stress, energy, and sleep trends over time to understand yourself better.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your data belongs to you. Export and share summaries with healthcare providers on your terms.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-card-hover transition-shadow duration-300"
            >
              <f.icon className="h-7 w-7 text-primary mb-5" strokeWidth={1.5} />
              <h3 className="font-display font-semibold text-lg mb-2 italic">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
