import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Patient",
    avatar: "S",
    avatarBg: "from-violet-400 to-purple-500",
    text: "TherapEASE finally helped me understand my mood cycles. The daily check-ins feel like journaling, but smarter — and the AI companion is genuinely comforting at 2am.",
    rating: 5,
    tag: "Anxiety & Depression",
  },
  {
    name: "Dr. James Chen",
    role: "Psychiatrist",
    avatar: "J",
    avatarBg: "from-blue-400 to-cyan-500",
    text: "Having all my patients' mood data, PHQ scores, and journal summaries in one place has transformed how I run sessions. I come in prepared, and outcomes have noticeably improved.",
    rating: 5,
    tag: "Clinical Practice",
  },
  {
    name: "Emily R., LMFT",
    role: "Licensed Therapist",
    avatar: "E",
    avatarBg: "from-emerald-400 to-teal-500",
    text: "Session management used to eat hours of my week. TherapEASE cut that down to minutes. My clients love the homework tracking and I love the clinical notes feature.",
    rating: 5,
    tag: "Practice Management",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-violet-400/10 -bottom-20 -right-20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-primary/15">
            Community Stories
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-5 leading-tight">
            Trusted by <span className="text-gradient-primary italic">real people</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Patients and professionals transforming mental health care together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-card border border-border rounded-2xl p-7 hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Quote icon watermark */}
              <Quote className="absolute top-4 right-5 h-12 w-12 text-primary/5 group-hover:text-primary/10 transition-colors duration-300" />

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Tag */}
                <div className="inline-block text-[10px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border mb-4">
                  {t.tag}
                </div>

                <p className="text-foreground/80 text-sm leading-relaxed mb-7 italic">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center"
        >
          {[
            { val: "10,000+", label: "Active Users" },
            { val: "98%", label: "Satisfaction Rate" },
            { val: "500+", label: "Professional Partners" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-display font-bold text-gradient-primary">{s.val}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
