import React from "react";

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

type OTPModalProps = {
    isOpen: boolean;
    data:SignupFormData
    onClose: () => void;
    onSubmit: (otp: number) => void;
};

const OTPModal = ({ isOpen, onClose, onSubmit, data }: OTPModalProps) => {
    const [otp, setOtp] = React.useState(["", "", "", ""]);
    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

    if (!isOpen) return null;

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        console.log("otp: ", otp);
        const arr = [...otp]
        const number = Number(arr.join(""));
        console.log(number);
        onSubmit(number);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
                >
                    ✖
                </button>

                <h2 className="text-xl font-semibold text-center mb-4">Verify OTP</h2>
                <p className="mb-4">OTP has been successfully sent to you email {data.email}</p>

                <div className="flex justify-center gap-3 mb-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputsRef.current[index] = el }}
                            type="text"
                            maxLength={1}
                            inputMode="numeric"
                            className="w-12 h-12 border border-gray-300 text-center text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                >
                    Submit OTP
                </button>
            </div>
        </div>
    );
};

export default OTPModal;
