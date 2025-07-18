import { useUser } from "../context/UseProvider"
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import { CreateProjectModal } from "../modals/createProjectModal";
import { fetchProjects } from "../apiCall/fetchProjects";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { DeleteProjectModal } from "../modals/DeleteProjectModal";
import { ProjectDetailsModal } from "../modals/ProjectDetailsModal";
import { FaPlus } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

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

function ManagerHome() {

    const { user } = useUser();
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    useEffect(() => {
        if (!user?._id) return;
        fetchProjects(user!._id)
            .then((res) => {
                console.log("res: ", res);
                setProjects(res)
            })
            .catch((error) => {
                console.log("error: ", error);
                toast.error("project fetching failed")
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user?._id]);

    return (
        <section className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">Your Projects</h1>
            <Button
                className="mb-4"
                onClick={() => {
                    setSelectedProject(null);
                    setModalOpen(true);
                }}
            >
                <FaPlus /> Project
            </Button>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-md" />
                    ))}
                </div>
            ) : projects && projects.length > 0 ? (
                <div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {projects.length > 0 && projects.map((project) => (
                            <Card key={project._id} className="relative border shadow-sm cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                    setSelectedProject(project);
                                    setDetailsModalOpen(true);
                                }}>
                                <CardHeader className="pb-2">
                                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                                        <Button
                                            variant="ghost"
                                            className="text-red-400 text-xs font-medium px-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setProjectIdToDelete(project._id);
                                                setDeleteModalOpen(true);
                                            }}
                                        >
                                            <MdOutlineDelete />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-gray-700 text-xs px-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProject(project);
                                                setModalOpen(true);
                                            }}
                                        >
                                            <FaRegEdit />
                                        </Button>
                                    </div>

                                    <CardTitle className="text-lg">{project.name}</CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                    <Badge variant="outline" className="capitalize text-xs mt-1">
                                        {project.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>
                                        <span className="font-medium">Team Size:</span> {project.teamSize}
                                    </p>
                                    <p>
                                        <span className="font-medium">Timeline:</span>{" "}
                                        {format(new Date(project.startDate), "dd MMM")} -{" "}
                                        {format(new Date(project.endDate), "dd MMM")}
                                    </p>
                                    <p className="mt-2 flex flex-wrap gap-1">
                                        {project.requiredSkills.map((skill) => (
                                            <Badge key={skill} className="text-xs" variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-6 bg-muted rounded-md text-center space-y-2 border border-dashed">
                    <p className="text-lg font-semibold">You haven’t created any projects yet</p>
                    <p className="text-sm text-muted-foreground">
                        Create a project to assign engineers and track team capacity
                    </p>
                </div>
            )}
            <CreateProjectModal
                setProjects={setProjects}
                open={modalOpen}
                onOpenChange={setModalOpen}
                project={selectedProject}
            />
            <DeleteProjectModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                projectId={projectIdToDelete}
                setProjects={setProjects}
            />
            {selectedProject && (
                <ProjectDetailsModal
                    open={detailsModalOpen}
                    onOpenChange={setDetailsModalOpen}
                    projectId={selectedProject._id}
                />
            )}

        </section>
    )
}

export default ManagerHome