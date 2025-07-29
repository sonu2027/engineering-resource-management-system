
type AssignmentPayload = {
    engineerId: string;
    projectId: string;
    allocationPercentage: number;
    startDate: string;
    endDate: string;
    role: string;
};

export const createAssignment = async (payload: AssignmentPayload) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const responseData = await res.json();

        if (res.status === 400) {
            throw new Error(responseData.message || "Invalid request");
        }

        if (!res.ok) {
            throw new Error(responseData.message || "Failed to create assignment");
        }

        return responseData.assignment;
    } catch (error: any) {
        throw new Error(error.message || "Something went wrong");
    }
};
