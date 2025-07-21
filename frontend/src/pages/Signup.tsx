import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { SelectTrigger } from "../components/ui/select";
import { SelectValue } from "../components/ui/select";
import { SelectContent } from "../components/ui/select";
import { SelectItem } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";

import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import signupUser from "../apiCall/signupUser";
import { sendEmailVerificationOTP } from "../apiCall/sendEmailVerificationOTP";
import { checkCookies } from "../apiCall/checkCookies";
import OTPModal from "../modals/OTPModal";

const skillOptions = [
  "React", "Node.js", "Python", "MongoDB", "Django", "Express", "AWS", "TypeScript"
];

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

  const selectedRole = watch("role");
  const [otp, setOtp] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkCookies()
      .then((res) => {
        if (res.success) navigate("/home");
      })
      .catch(() => navigate("/login"));
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    sendEmailVerificationOTP(data.email)
      .then((res) => {
        toast.success("OTP sent successfully");
        setOtp(res);
        setOpen(true);
      })
      .catch((error) => console.log("OTP error:", error));
  };

  const handleSignup = (number: number) => {
    const currentValues = watch();
    const payload = {
      ...currentValues,
      maxCapacity: currentValues.role === "engineer"
        ? currentValues.employmentType === "full-time" ? 100 : 50
        : 0,
      skills: currentValues.skills || []
    };

    if (number === otp) {
      signupUser(payload)
        .then(() => {
          toast.success("Account created successfully");
          navigate("/login");
        })
        .catch((error) => {
          toast.error(error.message === "User already exists" ? error.message : "User creation failed");
          setOpen(false);
        });
    } else {
      toast.error("OTP doesn't match");
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 py-8 px-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-xl px-8 py-6 w-full max-w-lg space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-black">Create Account</h2>

        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 7, message: "Min 7 characters" },
              maxLength: { value: 50, message: "Max 50 characters" },
              pattern: {
                value: /^[A-Za-z]{3,15}\s[A-Za-z]{3,15}$/,
                message:
                  "Enter first and last name — each 3-15 letters, single space only, no symbols",
              },
            })}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              maxLength: { value: 100, message: "Max 100 characters" },
              pattern: {
                value: /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.(com|in|org|net|ac\.in)$/,
                message: "Enter valid email"
              }
            })}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Role */}
        <div className="space-y-1">
          <Label>Role</Label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          />
        </div>

        {/* Engineer-specific */}
        {selectedRole === "engineer" && (
          <>
            <div className="space-y-1">
              <Label>Employment Type</Label>
              <Controller
                control={control}
                name="employmentType"
                render={({ field }) => (
                  <>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <Controller
                control={control}
                name="skills"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center gap-2">
                        <Checkbox
                          id={skill}
                          checked={field.value.includes(skill)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...field.value, skill]
                              : field.value.filter((s) => s !== skill);
                            field.onChange(updated);
                          }}
                        />
                        <Label htmlFor={skill} className="text-sm font-medium">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Seniority */}
            <div className="space-y-1">
              <Label>Seniority</Label>
              <Controller
                control={control}
                name="seniority"
                render={({ field }) => (
                  <>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select seniority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
            </div>

            {/* Department */}
            <Controller
              control={control}
              name="department"
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "frontend", "backend", "devOps", "qa", "ui/ux", "ml", "data engineering"
                      ].map(dep => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-500">{errors.department.message}</p>
                  )}
                </div>
              )}
            />
          </>
        )}

        {/* Password */}
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
              maxLength: { value: 32, message: "Max 32 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,32}$/,
                message:
                  "Include uppercase, lowercase, number, special char & no spaces",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-black mx-2 hover:underline"
          >
            Login
          </button>
        </div>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>

      {open && (
        <OTPModal
          data={watch()}
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSignup}
        />
      )}
    </div>
  );
};

export default Signup;

