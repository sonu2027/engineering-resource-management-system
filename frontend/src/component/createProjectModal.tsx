import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useForm } from "react-hook-form";
import { useUser } from "../context/UseProvider";
import { useEffect, useState } from "react";
import { createProject } from "../apiCall/createProject";
import toast from "react-hot-toast";
import { fetchProjects } from "../apiCall/fetchProjects";

type FormData = {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[]; // ⬅ updated
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
};

export function CreateProjectModal({ setProjects }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      managerId: user?._id,
    };

    createProject(payload)
      .then((res) => {
        console.log("res in c: ", res);
        setOpen(false)
        toast.success("Project created successfully")
        return fetchProjects(user!._id)
      })
      .then((res) => {
        setProjects(res)
      })
      .catch((error) => {
        console.log("error: ", error);
      })
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" {...register("description")} />
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
            Create Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
