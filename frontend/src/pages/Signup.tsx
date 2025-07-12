import { useForm, Controller } from "react-hook-form";
import Input from "../components/Input";
import Select from "../components/Select";
import { useNavigate } from "react-router-dom";
import signupUser from "../apiCall/signupUser";
import { sendEmailVerificationOTP } from "../apiCall/sendEmailVerificationOTP";
import { useState } from "react";
import OTPModal from "../modals/OTPModal";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { checkCookies } from "../apiCall/checkCookies";

type SignupFormData = {
  name: string;
  email: string;
  role: "engineer" | "manager";
  employmentType?: "full-time" | "part-time";
  skills: string[];
  seniority?: "junior" | "mid" | "senior";
  department?: string;
  password: string;
};

const skillOptions = [
  "React",
  "Node.js",
  "Python",
  "MongoDB",
  "Django",
  "Express",
  "AWS",
  "TypeScript"
];

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<SignupFormData>({
    defaultValues: {
      role: "manager",
      employmentType: "full-time",
      seniority: "junior",
      skills: []
    }
  });

  const [otp, setOtp] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormData) => {

    sendEmailVerificationOTP(data.email)
      .then((res) => {
        toast.success("OTP sent successfully")
        console.log("res", res, typeof res);
        setOtp(res)
        setOpen(true)
      })
      .catch((error) => {
        console.log("otp error: ", error);
      })
  };

  const handleSignup = (number: number) => {
    const currentValues = watch();
    console.log("On mount form values:", currentValues);

    const payload = {
      ...currentValues,
      maxCapacity: currentValues.role === "engineer"
        ? currentValues.employmentType === "full-time"
          ? 100
          : 50
        : 0,
      skills: currentValues.skills || []
    };

    console.log("payload: ", payload, number, typeof number, otp, typeof otp);


    if (number === otp) {
      signupUser(payload)
        .then((res) => {
          console.log("signup res: ", res);
          toast.success("Account created successfully");
          navigate("/login");
        })
        .catch((error) => {
          if (error.message === 'User already exists')
            toast.error("User already exists")
          else if (error.message === "User creation failed")
            toast.error("User creation failed")
          console.log("Error is: ", error.message);
          setOpen(false)
        })
    }
    else {
      toast.error("OTP doesn't match")
      setOpen(false)
    }
  }

  useEffect(() => {
    checkCookies()
      .then((res) => {
        if (res.success) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log("error in home: ", error);
        navigate("/login")
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 pt-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-xl px-10 py-8 w-full max-w-lg space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">Create Account</h2>

        <div className="space-y-4">
          <Input
            label="Name"
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 7,
                message: "Name must be at least 7 characters"
              },
              maxLength: {
                value: 50,
                message: "Name must be at most 50 characters"
              },
              pattern: {
                value: /^(?=.*\s)[a-zA-Z\s]{7,50}$/,
                message: "Enter full name with at least one space and only letters"
              }
            })}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

          <Input
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              maxLength: {
                value: 100,
                message: "Email must be at most 100 characters long",
              },
              pattern: {
                value: /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.(com|in|org|net|ac\.in)$/,
                message: "Please enter a valid email address without consecutive dots"
              }
            })}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

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

              <div>
                <label className="text-sm font-medium text-gray-600">Skills</label>
                <Controller
                  control={control}
                  name="skills"
                  render={({ field }) => {
                    const { value = [], onChange } = field;
                    const toggleSkill = (skill: string) => {
                      if (value.includes(skill)) {
                        onChange(value.filter((s) => s !== skill));
                      } else {
                        onChange([...value, skill]);
                      }
                    };

                    return (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {skillOptions.map((skill) => (
                          <label key={skill} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={value.includes(skill)}
                              onChange={() => toggleSkill(skill)}
                            />
                            <span>{skill}</span>
                          </label>
                        ))}
                      </div>
                    );
                  }}
                />
              </div>

              <Select
                label="Seniority"
                {...register("seniority")}
                options={["junior", "mid", "senior"]}
              />

              <Select
                label="Department"
                {...register("department")}
                options={[
                  "frontend",
                  "backend",
                  "devOps",
                  "qa",
                  "ui/ux",
                  "ml",
                  "data engineering"
                ]}
              />
            </>
          )}

          <Input
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              maxLength: {
                value: 32,
                message: "Password must be at most 32 characters long",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,32}$/
                ,
                message:
                  "Password must include uppercase, lowercase, number, special character, and no spaces",
              },
            })}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

          <div className="text-sm">
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
      {
        open && <OTPModal data={watch()} isOpen={open} onClose={() => setOpen(false)} onSubmit={handleSignup} />
      }
    </div>
  );
};

export default Signup;
