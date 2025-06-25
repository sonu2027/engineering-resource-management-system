type Engineer = {
    _id: string;
    name: string;
    seniority?: "junior" | "mid" | "senior";
    department?: string;
    skills: string[];
    maxCapacity?: number;
};

export const fetchEngineers = async (): Promise<Engineer[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/engineers`, {
        credentials: "include", 
    });

    if (!res.ok) {
        throw new Error("Failed to fetch engineers");
    }

    const data = await res.json();
    return data.engineers;
};
