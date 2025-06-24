import { useUser } from "../context/UseProvider"
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { format } from "date-fns";
import { CreateProjectModal } from "../component/createProjectModal";
import { fetchProjects } from "../apiCall/fetchProjects";
import toast from "react-hot-toast";

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

function Home() {

  const { user } = useUser();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (user?.role === "manager") {
    return (
      <section className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Your Projects</h1>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-md" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <CreateProjectModal setProjects={setProjects} />
            {projects.length > 0 && projects.map((project) => (
              <Card key={project._id} className="border shadow-sm">
                <CardHeader className="pb-2">
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
        ) : (
          <div className="p-6 bg-muted rounded-md text-center space-y-2 border border-dashed">
            <p className="text-lg font-semibold">You haven’t created any projects yet</p>
            <p className="text-sm text-muted-foreground">
              Create a project to assign engineers and track team capacity
            </p>
            <CreateProjectModal setProjects={setProjects} />
          </div>
        )}
      </section>
    )
  }
  return (
    <div>Homes</div>
  )
}

export default Home