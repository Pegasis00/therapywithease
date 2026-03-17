import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Save, User } from "lucide-react";
import { toast } from "sonner";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Textarea } from "@/components/ui/textarea";

interface Patient { id: string; full_name: string; email: string }

/**
 * ClinicalNoteEditor — always renders inline (no modal overlay).
 * Legacy isOpen/onClose props are kept for backward compatibility but ignored.
 */
export const ClinicalNoteEditor = ({
    onClose = () => { },
}: {
    isOpen?: boolean;
    onClose?: () => void;
}) => {
    const [note, setNote] = useState("");
    const [patientId, setPatientId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const { user, getToken } = useKindeAuth();

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const token = await getToken();
                if (!token) return;
                const res = await fetch("/api/patients", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPatients(data);
                }
            } catch (err) {
                console.error("Failed to load patients:", err);
            }
        };
        loadPatients();
    }, [getToken]);

    const handleSubmit = async () => {
        if (!note.trim() || !patientId) {
            toast.error("Please select a patient and write a note");
            return;
        }
        if (!user?.id) { toast.error("Not authenticated"); return; }

        setIsSubmitting(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("No token");

            const res = await fetch("/api/clinical_notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientId: patientId,
                    content: note.trim(),
                    isPrivate: true
                })
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Clinical note saved successfully");
            setNote("");
            setPatientId("");
            onClose();
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to save note — check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => { setNote(""); setPatientId(""); };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-card"
        >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center gap-2 bg-secondary/30">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-display font-semibold text-sm">New Clinical Note</span>
            </div>

            <div className="p-5 space-y-4">
                {/* Patient selector */}
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                        <User className="h-3 w-3" /> Select Patient
                    </label>
                    <select
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none"
                    >
                        <option value="">Choose a patient…</option>
                        {patients.length > 0 ? (
                            patients.map((p) => (
                                <option key={p.id} value={p.id}>{p.full_name || p.email}</option>
                            ))
                        ) : (
                            <option disabled>No patients in the system yet</option>
                        )}
                    </select>
                    {patients.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                            Patients will appear here once they sign up.
                        </p>
                    )}
                </div>

                {/* Note textarea */}
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Observations & Notes
                    </label>
                    <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Document clinical observations, session summary, progress notes, treatment plans, or risk assessments…"
                        className="h-44 rounded-xl resize-none focus-visible:ring-primary/30"
                    />
                    <div className="flex justify-end mt-1">
                        <span className="text-[10px] text-muted-foreground/60">{note.length} characters</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <Button
                        variant="ghost"
                        className="rounded-xl text-sm"
                        onClick={handleReset}
                        disabled={!note && !patientId}
                    >
                        Clear
                    </Button>
                    <Button
                        className="flex-1 rounded-xl text-sm bg-gradient-hero hover:opacity-95"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !patientId || !note.trim()}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Saving…" : "Save Clinical Note"}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
