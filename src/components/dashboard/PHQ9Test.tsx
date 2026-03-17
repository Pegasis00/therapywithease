import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardList, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking so slowly that others noticed, or being fidgety or restless",
    "Thoughts that you would be better off dead or of hurting yourself",
];

const options = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
];

const getResult = (score: number) => {
    if (score <= 4) return { label: "Minimal depression", color: "text-green-500" };
    if (score <= 9) return { label: "Mild depression", color: "text-yellow-500" };
    if (score <= 14) return { label: "Moderate depression", color: "text-orange-500" };
    if (score <= 19) return { label: "Moderately severe depression", color: "text-red-500" };
    return { label: "Severe depression", color: "text-red-700" };
};

interface PHQ9TestProps {
    isOpen?: boolean;
    onClose?: () => void;
    inline?: boolean;
}

export const PHQ9Test = ({ isOpen = true, onClose = () => { }, inline = false }: PHQ9TestProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const { user, getToken } = useKindeAuth();

    const handleAnswer = (value: number) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitTest(newAnswers);
        }
    };

    const submitTest = async (finalAnswers: number[]) => {
        const score = finalAnswers.reduce((a, b) => a + b, 0);
        const severity = getResult(score).label;
        setIsFinished(true);

        if (!user?.id) { toast.error("Not authenticated"); return; }

        try {
            const token = await getToken();
            if (!token) throw new Error("No token");

            const res = await fetch("/api/assessments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: "PHQ-9",
                    score,
                    severity,
                    answers: { responses: finalAnswers },
                })
            });

            if (!res.ok) throw new Error("Failed to save");
            
            toast.success("Assessment saved to your profile!");
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to save assessment — check console.");
        }
    };

    const reset = () => {
        setCurrentStep(0);
        setAnswers([]);
        setIsFinished(false);
    };

    const score = answers.reduce((a, b) => a + b, 0);
    const result = getResult(score);

    const content = (
        <div className={inline ? "" : "p-8"}>
            {!isFinished ? (
                <>
                    <div className="mb-8">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span>Question {currentStep + 1} of {questions.length}</span>
                            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2 text-center">Over the last 2 weeks, how often have you been bothered by:</p>
                    <h3 className="text-lg font-display font-semibold mb-8 text-center leading-relaxed text-primary">
                        {questions[currentStep]}
                    </h3>

                    <div className="space-y-3">
                        {options.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => handleAnswer(opt.value)}
                                className="w-full p-4 text-left rounded-xl border border-border hover:border-primary/50 hover:bg-secondary transition-all text-sm font-medium"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold mb-2">Assessment Complete</h2>
                    <p className="text-muted-foreground mb-8">Thank you for completing the PHQ-9.</p>

                    <div className="bg-secondary/50 rounded-2xl p-6 mb-6 text-left border border-border">
                        <div className="text-sm text-muted-foreground mb-1">Your Score</div>
                        <div className="text-4xl font-display font-bold text-primary mb-2">{score} <span className="text-xl text-muted-foreground">/ 27</span></div>
                        <div className={`inline-block px-3 py-1.5 rounded-full bg-muted text-xs font-bold uppercase tracking-wider ${result.color}`}>
                            {result.label}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            This is for informational purposes only. Please consult your care team for guidance.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-full" onClick={reset}>Retake Test</Button>
                        <Button className="flex-1 rounded-full" onClick={onClose}>Back to Dashboard</Button>
                    </div>
                </div>
            )}
        </div>
    );

    if (inline) {
        if (isOpen === false) return null;
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-lg mx-auto bg-card border border-border rounded-2xl overflow-hidden"
            >
                <div className="p-4 border-b border-border flex items-center gap-2 bg-secondary/50">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <span className="font-display font-semibold text-sm">PHQ-9 Health Questionnaire</span>
                </div>
                {content}
            </motion.div>
        );
    }

    // Modal mode (backward compatible)
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/50">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <span className="font-display font-semibold text-sm">PHQ-9 Health Questionnaire</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {content}
            </motion.div>
        </div>
    );
};
