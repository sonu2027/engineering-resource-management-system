import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import loginUser from "../apiCall/loginUser";
import toast from "react-hot-toast";
import { useUser } from "../context/UseProvider";
import { checkCookies } from "../apiCall/checkCookies";
import { useEffect } from "react";

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
        setValue,
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

    const loginAsTestUser = () => {
        setValue("email", "manager@example.com");
        setValue("password", "Manager@1");

        setTimeout(() => {
            handleSubmit(onSubmit)();
        }, 0);
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
                    </div>

                    <div>
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
                        onClick={loginAsTestUser}
                        type="button"
                        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Login as test user
                    </button>

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
