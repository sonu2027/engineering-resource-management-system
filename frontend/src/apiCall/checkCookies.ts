const checkCookies = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check-cookie`, {
      method: "GET",
      credentials: "include", 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Not authenticated");
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export { checkCookies };
