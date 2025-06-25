export const fetchAssignmentsByProject = async (projectId: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/${projectId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch assignments");

  const data = await res.json();
  return data.assignments;
};
