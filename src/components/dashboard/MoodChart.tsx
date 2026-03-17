import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const moodValues: Record<string, number> = {
    "Great": 5,
    "Good": 4,
    "Okay": 3,
    "Low": 2,
    "Not Good": 1
};

interface MoodData {
    date: string;
    value: number;
    label: string;
}

export const MoodChart = () => {
    const [data, setData] = useState<MoodData[]>([]);
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

                if (!res.ok) throw new Error("Fetch failed");
                const moods = await res.json();

                const formatted = moods.map((m: any) => ({
                    date: new Date(m.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
                    value: moodValues[m.mood] || 2,
                    label: m.mood
                }));

                setData(formatted);
            } catch (error) {
                console.error("Failed to load mood history:", error);
            }
        };

        fetchMoods();
    }, [user, getToken]);

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm italic">
                No mood data yet. Start tracking to see your patterns!
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748B' }}
                        dy={10}
                    />
                    <YAxis
                        domain={[0, 4]}
                        hide
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-card border border-border p-2 rounded-lg shadow-sm text-xs font-medium">
                                        {payload[0].payload.label}
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
                        strokeWidth={3}
                        dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
