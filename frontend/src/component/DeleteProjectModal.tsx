import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import { deleteProject } from "../apiCall/deleteProject";
import { fetchProjects } from "../apiCall/fetchProjects";
import { useUser } from "../context/UseProvider";

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  projectId: string | null;
  setProjects: React.Dispatch<React.SetStateAction<Project[] | null>>;
};

type Project = {
  _id: string;
  name: string;
  description?: string;
  status: "planning" | "active" | "completed";
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
};


export const DeleteProjectModal = ({
  open,
  onOpenChange,
  projectId,
  setProjects,
}: Props) => {
  const { user } = useUser();

  const handleDelete = async () => {
    if (!projectId) return;

    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      const updated = await fetchProjects(user!._id);
      setProjects(updated);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            No, Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
