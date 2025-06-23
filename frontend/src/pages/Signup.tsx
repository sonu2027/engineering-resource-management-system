import { useForm } from "react-hook-form";
import Input from "../component/Input";
import Select from "../component/Select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type SignupFormData = {
  name: string;
  email: string;
  role: "engineer" | "manager";
  employmentType?: "full-time" | "part-time";
  skills?: string;
  seniority?: "junior" | "mid" | "senior";
  department?: string;
  password: string;
};

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignupFormData>({
    defaultValues: {
      role: "engineer",
      employmentType: "full-time",
      seniority: "junior"
    }
  });

  const navigate = useNavigate();

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormData) => {
    try {
      const payload = {
        ...data,
        maxCapacity: data.role === "engineer"
          ? data.employmentType === "full-time"
            ? 100
            : 50
          : 0,
        skills: data.skills?.split(",").map((s) => s.trim()) || []
      };

      const res = await axios.post("/api/auth/signup", payload);
      console.log(res);
      
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 pt-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-xl px-10 py-8 w-full max-w-lg space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">Create Account</h2>

        <div className="space-y-4">
          <div>
            <Input
              label="Name"
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <Select
            label="Role"
            {...register("role")}
            options={["engineer", "manager"]}
          />

          {selectedRole === "engineer" && (
            <>
              <Select
                label="Employment Type"
                {...register("employmentType")}
                options={["full-time", "part-time"]}
              />

              <Input
                label="Skills (comma-separated)"
                type="text"
                {...register("skills")}
              />

              <Select
                label="Seniority"
                {...register("seniority")}
                options={["junior", "mid", "senior"]}
              />
            </>
          )}

          <Input
            label="Department"
            type="text"
            {...register("department")}
          />

          <div>
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-600 mx-2 hover:underline"
            >
              Login
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
