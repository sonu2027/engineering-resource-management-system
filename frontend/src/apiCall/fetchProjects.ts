type Project = {
    _id: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    requiredSkills: string[];
    teamSize: number;
    status: "planning" | "active" | "completed";
    managerId: string;
};

const fetchProjects = async (managerId: string): Promise<Project[]> => {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/projects?managerId=${managerId}`,
            {
                credentials: "include", // 👈 sends cookie for auth
            }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch projects: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("data: ", data);
        
        return data.projects; // assuming API returns { projects: [...] }
    } catch (err) {
        console.error("Fetch Projects Error:", err);
        throw err;
    }
};

export { fetchProjects };
