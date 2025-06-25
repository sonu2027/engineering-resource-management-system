type AssignmentPayload = {
    engineerId: string;
    projectId: string;
    allocationPercentage: number;
    startDate: string;
    endDate: string;
    role: string;
};

export const createAssignment = async (payload: AssignmentPayload) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create assignment");
    }

    const data = await res.json();
    return data.assignment;
};
