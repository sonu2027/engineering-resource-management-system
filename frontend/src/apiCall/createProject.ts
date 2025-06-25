type FormData = {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    requiredSkills: string[];
    teamSize: number;
    status: "planning" | "active" | "completed";
};

const createProject = async (data: FormData) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/projects`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", 
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to create project: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData.project;
    } catch (error) {
        throw error;
    }
};


export { createProject };