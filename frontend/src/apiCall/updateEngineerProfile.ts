export const updateEngineerProfile = async (engineerId: string, payload: any) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/engineers/${engineerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update profile");
  }

  return res.json();
};
