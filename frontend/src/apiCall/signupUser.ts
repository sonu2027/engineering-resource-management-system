type SignupFormData = {
  name: string;
  email: string;
  role: "engineer" | "manager";
  employmentType?: "full-time" | "part-time";
  skills?: string[];
  seniority?: "junior" | "mid" | "senior";
  department?: string;
  password: string;
};

const signupUser = async (userData: SignupFormData) => {

  console.log("userData: ", userData);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData),
        // credentials: "include"
      }
    );
    let data = await response.json();
    console.log("data is: ", data);

    if (data.message === 'User creation failed')
      throw new Error("User creation failed");

    if (data.userExist)
      throw new Error("User already exists");

    return data.data;
  } catch (error) {
    throw error;
  }
};

export default signupUser;