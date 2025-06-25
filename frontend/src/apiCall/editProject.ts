type FormData = {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    requiredSkills: string[];
    teamSize: number;
    status: "planning" | "active" | "completed";
};

const editProject = async (projectId: string, data: FormData) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to update project: ${response.statusText}`);
        }

        const result = await response.json();
        return result.updatedProject;
    } catch (error) {
        throw error;
    }
};

export { editProject };