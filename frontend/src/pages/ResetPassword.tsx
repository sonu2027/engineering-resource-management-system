import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UseProvider";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!oldPassword || !newPassword) {
            toast.error("Please fill both fields");
            return;
        }

        if (!user?._id) return

        const userId = user?._id
        console.log("userId", userId);


        try {
            setIsSubmitting(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ oldPassword, newPassword, userId }),
            });

            if (!res.ok) throw new Error();
            toast.success("Password changed successfully");
            setOldPassword("");
            setNewPassword("");
            navigate(-1)
        } catch (err) {
            toast.error("Failed to change password");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="w-full max-w-md px-4 py-8 mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center text-blue-600">Change Password</h2>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Current Password</label>
                    <Input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">New Password</label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
            </div>
        </div>
    );
};
