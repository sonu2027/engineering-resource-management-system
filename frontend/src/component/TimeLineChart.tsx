import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { fetchAssignmentTimeline } from "../apiCall/fetchAssignmentTimeline";
type AssignmentBar = {
    engineer: string;
    project: string;
    startDate: string;
    endDate: string;
    allocation: number;
    role: string;
};

export const TimelineChart = () => {
    const [timeline, setTimeline] = useState<AssignmentBar[]>([]);


    useEffect(() => {
        fetchAssignmentTimeline().then((data) => setTimeline(data.timeline));
    }, []);

    const processed = timeline.map((d) => ({
        name: `${d.engineer} → ${d.project}`,
        start: new Date(d.startDate).getTime(),
        end: new Date(d.endDate).getTime(),
        duration:
            (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) /
            (1000 * 3600 * 24),
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={processed}>
                <XAxis type="number" domain={["dataMin", "dataMax"]} hide />
                <YAxis dataKey="name" type="category" width={200} />
                <Tooltip
  formatter={(value) => `${value} days`}
  labelFormatter={(label) => `${label}`}
/>
                <Bar dataKey="duration" fill="#3b82f6"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

