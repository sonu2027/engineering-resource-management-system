const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ email, password }),
            }
        );

        const data = await response.json();
        console.log("login data: ", data);
        
        return data;
    } catch (error) {
        return error;
    }
};

export default loginUser;