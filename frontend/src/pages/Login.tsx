import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import loginUser from "../apiCall/loginUser";
import toast from "react-hot-toast";
import { useUser } from "../context/UseProvider";

type LoginFormData = {
    email: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        loginUser(data.email, data.password)
            .then((res) => {
                if (res.message === "Email not found")
                    toast.error("Email not found")
                else if (res.message === 'Incorrect password')
                    toast.error("Incorrect password")
                else {
                    setUser(res.user);
                    navigate("/home")
                }
            })
            .catch((error) => {
                console.log("error: ", error);
                toast.error("Internal server error")
            })
    };

    const handleForgotPassword = () => {
        navigate("/change-password")
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-xl rounded-xl px-10 py-8 w-full max-w-md space-y-6 border border-gray-200"
            >
                <h2 className="text-3xl font-bold text-center text-indigo-700">
                    Login to your Account
                </h2>

                <div className="space-y-4">
                    <div>
                        <Input
                            label="Email"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="text-sm">
                        <span>Don't have an account?</span>
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="font-medium text-indigo-600 mx-2 hover:underline"
                        >
                            Signup
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>

                    <div className="text-sm text-right">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-indigo-600 hover:underline hover:text-indigo-800 transition"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
