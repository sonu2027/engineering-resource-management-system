import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import { fetchAssignmentsByProject } from "../apiCall/fetchAssignmentsByProject";
import { deleteAssignment } from "../apiCall/deleteAssignment";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
};

export const ProjectDetailsModal = ({ open, onOpenChange, projectId }: Props) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !projectId) return;

    fetchAssignmentsByProject(projectId)
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [open, projectId]);

  const handleDelete = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId);
      toast.success("Assignment deleted!");

      const updated = await fetchAssignmentsByProject(projectId);
      setAssignments(updated);
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assigned Engineers</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No engineers assigned yet</p>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div key={a._id} className="p-2 border rounded-md">
                <div className="flex justify-between font-medium">
                  <span>
                    <div>{a.engineerId.name}</div>
                    <div className="text-[12px]">{a.engineerId.email}</div>
                  </span>
                  <span className="text-xs">
                    {a.role} ({a.allocationPercentage}%)
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {new Date(a.startDate).toLocaleDateString()} –{" "}
                  {new Date(a.endDate).toLocaleDateString()}
                </p>

                <div className="mt-1 flex flex-wrap gap-1">
                  {a.engineerId.skills.map((s: string) => (
                    <Badge key={s} className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDelete(a._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
