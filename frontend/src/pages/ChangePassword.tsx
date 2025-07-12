import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import verifyEmail from "../apiCall/verifyEmail";
import { sendEmailVerificationOTP } from "../apiCall/sendEmailVerificationOTP";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const [step, setStep] = useState<"email" | "otp" | "password">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [serverOtp, setServerOtp] = useState<number>(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate()

    const handleEmailSubmit = async () => {

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|ac\.in)$/;

        if (email.length > 100) {
            toast.error("Email must be at most 100 characters long.");
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        verifyEmail(email)
            .then(() => {
                return sendEmailVerificationOTP(email)
            })
            .then((OTP) => {
                setServerOtp(OTP)
                setStep("otp");
                toast.success("OTP sent to your email.");
            })
            .catch((error) => {
                toast.error(error)
            })
    };

    const handleOtpSubmit = () => {
        const enteredOtp = Number(otp.join(''));
        if (enteredOtp !== serverOtp) {
            toast.error("Incorrect OTP.");
            return;
        }
        setStep("password");
    };

    const handlePasswordSubmit = async () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,32}$/;

        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must be 8–32 characters, include uppercase, lowercase, number, special character, and no spaces."
            );
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password.");
            }

            toast.success("Password changed successfully!");
            navigate("/login")
        } catch (err: any) {
            toast.error(err.message || "Something went wrong.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-sm space-y-6">
            {step === "email" && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            maxLength={100}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <Button className="w-full mt-4" onClick={handleEmailSubmit}>
                        Send OTP
                    </Button>
                </>
            )}

            {step === "otp" && (
                <>
                    <Label className="block text-center text-lg font-medium mb-2">Enter OTP</Label>
                    <p className="mb-4 text-center">OTP has been successfully sent to you email {email}</p>
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, idx) => (
                            <Input
                                key={idx}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!/^\d?$/.test(val)) return;

                                    const newOtp = [...otp];
                                    newOtp[idx] = val;
                                    setOtp(newOtp);

                                    if (val && idx < otp.length - 1) {
                                        const next = document.getElementById(`otp-${idx + 1}`);
                                        next?.focus();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                                        const prev = document.getElementById(`otp-${idx - 1}`);
                                        prev?.focus();
                                    }
                                }}
                                id={`otp-${idx}`}
                                className="w-12 h-12 text-center text-lg font-semibold tracking-widest"
                            />
                        ))}
                    </div>
                    <Button className="w-full mt-6" onClick={handleOtpSubmit}>
                        Verify OTP
                    </Button>
                </>
            )}

            {step === "password" && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="space-y-2 mt-4">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-type password"
                        />
                    </div>
                    <Button className="w-full mt-4" onClick={handlePasswordSubmit}>
                        Change Password
                    </Button>
                </>
            )}
        </div>
    );
}

export default ChangePassword;
