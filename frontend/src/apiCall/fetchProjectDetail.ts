export const fetchProjectDetail = async (projectId: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/full`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch project info");

  return res.json(); // returns { project, assignments }
};
