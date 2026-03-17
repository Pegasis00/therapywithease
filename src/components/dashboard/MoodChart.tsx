import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const moodValues: Record<string, number> = {
    "Great": 5,
    "Good": 4,
    "Okay": 3,
    "Low": 2,
    "Not Good": 1,
};

interface MoodData {
    date: string;
    value: number;
    label: string;
}

export const MoodChart = () => {
    const [data, setData] = useState<MoodData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, getToken } = useKindeAuth();

    useEffect(() => {
        const fetchMoods = async () => {
            if (!user) return;
            try {
                const token = await getToken();
                if (!token) return;

                const res = await fetch('/api/mood_checkins/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                const moods = await res.json();

                const formatted: MoodData[] = moods.map((m: any) => {
                    // Drizzle with neon-http returns camelCase field names
                    const dateStr = m.createdAt || m.created_at;
                    return {
                        date: new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
                        value: moodValues[m.mood] ?? 3,
                        label: m.mood,
                    };
                });

                setData(formatted);
            } catch (error) {
                console.error("Failed to load mood history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoods();
    }, [user, getToken]);

    if (isLoading) {
        return (
            <div className="h-[200px] flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Loading mood data…</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm italic">
                No mood data yet — log your first mood above!
            </div>
        );
    }

    return (
        <div className="h-[200px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        dy={8}
                    />
                    <YAxis
                        domain={[0, 5]}
                        hide
                    />
                    <ReferenceLine y={3} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-card border border-border p-2 rounded-xl shadow-lg text-xs font-medium">
                                        <div className="text-foreground">{payload[0].payload.label}</div>
                                        <div className="text-muted-foreground">{payload[0].payload.date}</div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                        activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
