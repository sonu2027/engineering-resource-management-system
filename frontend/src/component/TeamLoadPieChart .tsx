import { Pie, PieChart, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { fetchTeamLoad } from "../apiCall/fetchTeamLoad";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];
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
        fetchTeamLoad().then((res) => setData(res.team));
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
                        label
                    >
                        {processed.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}

                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ maxHeight: 300, overflowY: "auto" }} layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};