import { useEffect, useState } from "react";
import { fetchEngineers } from "../apiCall/fetchEngineers";
import { fetchProjects } from "../apiCall/fetchProjects";
import { AssignmentForm } from "../components/AssignmentForm";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useUser } from "../context/UseProvider";
import { ManagerNavbar } from "../components/ManagerNavbar";
import { useNavigate } from "react-router-dom";
import { checkCookies } from "../apiCall/checkCookies";

export const EngineerListPage = () => {
  const [engineers, setEngineers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState<string | null>(null);
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const filteredEngineers = engineers.filter((eng) =>
    eng.skills.some((skill: string) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const navigate = useNavigate()

  useEffect(() => {
    if (!user?._id) return;

    Promise.all([
      fetchEngineers(),
      fetchProjects(user._id),
    ])
      .then(([engineerList, projectList]) => {
        console.log(engineerList);

        setEngineers(engineerList);
        setProjects(projectList);
      })
      .catch(console.error);
  }, [user?._id]);

  useEffect(() => {
    checkCookies()
      .then((res) => {
        if (!res.success) {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log("error in home: ", error);
        navigate("/login")
      })
  }, [])


  return (
    <div>
      <ManagerNavbar />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by skill (e.g., React)"
          className="w-full px-3 py-2 border rounded text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="p-6 space-y-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by skill (e.g., React)"
            className="w-full px-3 py-2 border rounded text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEngineers.map((eng) => (
            <div key={eng._id} className="border rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium">{eng.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {eng.seniority} — {eng.department}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">Email:</span> {eng.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Type:</span> {eng.employmentType} |
                    <span className="ml-2 font-medium">Capacity:</span> {eng.availableCapacity}%
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedEngineerId((prev) =>
                      prev === eng._id ? null : eng._id
                    )
                  }
                >
                  {selectedEngineerId === eng._id ? "Cancel" : "Assign"}
                </Button>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {eng.skills.map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>

              {selectedEngineerId === eng._id && (
                <div className="mt-4 border-t pt-4">
                  <AssignmentForm
                    engineerId={eng._id}
                    projects={projects}
                    onAssigned={() => setSelectedEngineerId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
