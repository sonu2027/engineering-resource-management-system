const logoutUser = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Logout failed.");
        }

        window.location.href = "/login";
    } catch (error: any) {
        console.error("Logout error:", error);
    }
};

export { logoutUser };
