export const fetchTeamLoad = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/team-load`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch team load");
  return res.json(); // returns { team: [...] }
};
