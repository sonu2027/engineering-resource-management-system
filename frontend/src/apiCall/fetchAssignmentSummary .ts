export const fetchAssignmentSummary = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/assignment-summary`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load summary");
  return res.json(); // returns { summary: [...] }
};
