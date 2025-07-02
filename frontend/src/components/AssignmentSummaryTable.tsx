import { useEffect, useState } from "react";
import { fetchAssignmentSummary } from "../apiCall/fetchAssignmentSummary ";

type AssignmentRow = {
    id: string;
    engineer: string;
    email: string;
    department: string;
    project: string;
    status: string;
    role: string;
    allocation: number;
    startDate: string;
    endDate: string;
};


export const AssignmentSummaryTable = () => {
    const [rows, setRows] = useState<AssignmentRow[]>([]);
    useEffect(() => {
        fetchAssignmentSummary().then((data) => setRows(data.summary));
    }, []);

    return (
        <div className="overflow-x-auto">
            <h2 className="text-lg font-semibold mb-2">Engineer Assignment Summary</h2>
            <table className="min-w-full border text-sm">
                <thead className="bg-muted">
                    <tr>
                        <th className="px-3 py-2 text-left">Engineer</th>
                        <th className="px-3 py-2 text-left">Department</th>
                        <th className="px-3 py-2 text-left">Project</th>
                        <th className="px-3 py-2 text-left">Role</th>
                        <th className="px-3 py-2 text-left">Allocation</th>
                        <th className="px-3 py-2 text-left">Duration</th>
                        <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-t">
                            <td className="px-3 py-2">{r.engineer}</td>
                            <td className="px-3 py-2">{r.department}</td>
                            <td className="px-3 py-2">{r.project}</td>
                            <td className="px-3 py-2">{r.role}</td>
                            <td className="px-3 py-2">{r.allocation}%</td>
                            <td className="px-3 py-2">
                                {new Date(r.startDate).toLocaleDateString()} — {new Date(r.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2">{r.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
