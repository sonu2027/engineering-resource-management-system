import { Pie, PieChart, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { fetchTeamLoad } from "../apiCall/fetchTeamLoad";

// const COLORS = ["#10b981", "#f59e0b", "#ef4444"];
const COLORS = [
    "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6",
    "#ec4899", "#14b8a6", "#f97316", "#22c55e", "#eab308",
    "#6366f1", "#06b6d4", "#d946ef", "#4ade80", "#f43f5e",
    "#0ea5e9", "#a855f7", "#84cc16", "#fb923c", "#7c3aed"
];

type EngineerLoad = {
    name: string;
    department: string;
    maxCapacity: number;
    used: number;
    available: number;
};

export const TeamLoadPieChart = () => {
    const [data, setData] = useState<EngineerLoad[]>([]);

    useEffect(() => {
        fetchTeamLoad().then((res) => {
            const useeGreaterThanZero: EngineerLoad[] = res.team.filter((e: EngineerLoad) => e.used > 0)
            setData(useeGreaterThanZero)
        });
    }, []);

    const processed = data.map((eng) => ({
        name: eng.name,
        value: eng.used,
    }));

    return (
        <div className="w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-2">Team Load Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={processed}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ value }: any) => `${value}%`}
                    >
                        {processed.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}

                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string) => [`${value}% allocated`, name]}
                    />

                    <Legend wrapperStyle={{ maxHeight: 300, overflowY: "auto" }} layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};