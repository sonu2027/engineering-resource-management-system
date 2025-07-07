const checkSpacesForProject = async (projectId: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkspacesforproject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectId }),
            credentials: "include",
        })

        const responseData = await response.json()
        if (!response.ok) {
            throw new Error(responseData.message || "Something went wrong");
        }
        return responseData
    }
    catch (error) {
        return { success: false };
    }
}

export default checkSpacesForProject