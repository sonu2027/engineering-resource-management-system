import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useForm } from "react-hook-form";
import { useUser } from "../context/UseProvider";
import { useEffect } from "react";
import { createProject } from "../apiCall/createProject";
import toast from "react-hot-toast";
import { fetchProjects } from "../apiCall/fetchProjects";
import { editProject } from "../apiCall/editProject";

type FormData = {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
  status: "planning" | "active" | "completed";
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

const skillOptions = [
  "React",
  "Node.js",
  "Python",
  "MongoDB",
  "Django",
  "Express",
  "AWS",
  "TypeScript",
];

type Props = {
  setProjects: React.Dispatch<React.SetStateAction<Project[] | null>>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
};


export function CreateProjectModal({
  setProjects,
  open,
  onOpenChange,
  project,
}: Props) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();
  const { user } = useUser();

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      managerId: user?._id,
    };

    if (payload.teamSize < 1) {
      toast.error("Team size should be greater than 0")
      return
    }

    try {
      if (project) {
        await editProject(project._id, payload);
        toast.success("Project updated successfully");
        const updatedProjects = await fetchProjects(user!._id);
        setProjects(updatedProjects);
      } else {
        createProject(payload)
          .then((res) => {
            console.log("res in c: ", res);
            onOpenChange(false)
            toast.success("Project created successfully")
            return fetchProjects(user!._id)
          })
          .then((res) => {
            setProjects(res)
          })
          .catch((error) => {
            console.log("error: ", error);
          })
      }
      onOpenChange(false);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to save project");
    }
  };


  useEffect(() => {
    fetchProjects(user!._id)
      .then((res) => {
        setProjects(res)
      })
      .catch((error) => {
        console.log("error: ", error);
        toast.error("project fetching failed")
      })
  }, [])

  useEffect(() => {
    if (project && open) {
      setValue("name", project.name);
      setValue("description", project.description ?? "");
      setValue("startDate", project.startDate.slice(0, 10));
      setValue("endDate", project.endDate.slice(0, 10));
      setValue("requiredSkills", project.requiredSkills);
      setValue("teamSize", project.teamSize);
      setValue("status", project.status);
    } else if (!project && open) {
      reset();
    }
  }, [project, open]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" {...register("name", {
              required: "Project name is required",
              maxLength: {
                value: 80,
                message: "Description must be at most 80 characters",
              },
              pattern: {
                value: /^(?!\s)(?!.*\s$)(?!.*\s{2,})(?:(?=\S{1,20})[\w.,;:!?'"()\-]{1,20}(?:\s|$))*$/,
                message:
                  "Each word must be 1–20 characters. No extra/multiple spaces. Only letters/digits/punctuation allowed.",
              },
            })} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" {...register("description", {
              maxLength: {
                value: 300,
                message: "Description must be at most 300 characters",
              },
              pattern: {
                value: /^(?!\s)(?!.*\s$)(?!.*\s{2,})(?:(?=\S{1,20})[\w.,;:!?'"()\-]{1,20}(?:\s|$))*$/,
                message:
                  "Each word must be 1–20 characters. No extra/multiple spaces. Only letters/digits/punctuation allowed.",
              },
            },)} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="start">Start Date</Label>
              <Input id="start" type="date" {...register("startDate", { required: true })} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="end">End Date</Label>
              <Input id="end" type="date" {...register("endDate", { required: true })} />
            </div>
          </div>
          <div className="grid gap-1">
            <Label>Required Skills</Label>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={skill}
                    {...register("requiredSkills")}
                    className="accent-primary h-4 w-4"
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="team">Team Size</Label>
            <Input id="team" type="number" {...register("teamSize", { required: true })} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status", { required: true })}
              className="w-full border rounded px-3 py-2 text-sm"
              defaultValue="planning"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            {project ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}