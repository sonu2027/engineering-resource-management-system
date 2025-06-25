export const deleteAssignment = async (assignmentId: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete assignment");
    }

    return true; // or return response message if needed
};
