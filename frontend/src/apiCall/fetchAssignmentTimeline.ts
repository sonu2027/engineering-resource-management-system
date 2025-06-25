// apiCall/fetchAssignmentTimeline.ts
export const fetchAssignmentTimeline = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/assignment-timeline`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Timeline fetch failed");
  return res.json(); // { timeline: [...] }
};
