import { useEffect, useState } from "react";
import { fetchAssignmentsByEngineer } from "../apiCall/fetchAssignmentsByEngineer";
import { useUser } from "../context/UseProvider";
import toast from "react-hot-toast";
import { fetchProjectDetail } from "../apiCall/fetchProjectDetail";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";

function EngineerHome() {
    const { user } = useUser();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<{
        project: { name: string; description: string };
        assignments: { _id: string; role: string; allocationPercentage: number; engineerId: { name: string } }[];
    } | null>(null);

    const [modalOpen, setModalOpen] = useState(false);

    const handleSelect = async (projectId: string) => {
        try {
            const data = await fetchProjectDetail(projectId);
            setSelectedProject(data);
            setModalOpen(true);
        } catch {
            toast.error("Could not load project info");
        }
    };

    useEffect(() => {
        if (!user?._id) return;

        fetchAssignmentsByEngineer(user._id)
            .then(setAssignments)
            .catch(() => setAssignments([]))
            .finally(() => setLoading(false));
    }, [user?._id]);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">My Assignments</h1>

            {loading ? (
                <p>Loading...</p>
            ) : assignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assignments found</p>
            ) : (
                <div className="space-y-3">
                    {assignments.map((a) => (
                        <div onClick={() => handleSelect(a.projectId._id)} key={a._id} className="border p-3 rounded-md shadow-sm cursor-pointer hover:bg-muted">
                            <div className="flex justify-between">
                                <span className="font-medium">{a.projectId?.name}</span>
                                <span className="text-xs text-muted-foreground">{a.role} ({a.allocationPercentage}%)</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {new Date(a.startDate).toLocaleDateString()} — {new Date(a.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {modalOpen && selectedProject && (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{selectedProject.project.name}</DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-muted-foreground">{selectedProject.project.description}</p>
                        <p className="mt-2 text-sm font-medium">Assigned Engineers:</p>

                        <ul className="text-sm list-disc pl-5">
                            {selectedProject.assignments.map((a) => (
                                <li key={a._id}>
                                    {a.engineerId.name} – {a.role} ({a.allocationPercentage}%)
                                </li>
                            ))}
                        </ul>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
}

export default EngineerHome;
