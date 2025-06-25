const deleteProject = async (projectId: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete project");
  }

  return await res.json();
};

export { deleteProject };