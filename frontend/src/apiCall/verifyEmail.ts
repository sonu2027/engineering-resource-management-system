const verifyEmail = async (email: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/verifyemail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to verify email.");
    }

    const data = await response.json();
    console.log("data: ", data);
    
    return data;
  } catch (error: any) {
    console.error("verifyEmail error:", error);
    return { success: false, message: error.message || "Something went wrong." };
  }
};

export default verifyEmail;
