import { useForm } from "react-hook-form";
import { updateEngineerProfile } from "../apiCall/updateEngineerProfile";
import { useUser } from "../context/UseProvider";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";

export const EngineerProfile = () => {
    const { user } = useUser();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            skills: user?.skills?.join(", ") || "",
            seniority: user?.seniority || "",
            department: user?.department || "",
        },
    });

    const onSubmit = async (data: any) => {
        const payload = {
            skills: data.skills.split(",").map((s: string) => s.trim()),
            seniority: data.seniority,
            department: data.department,
        };

        try {
            if (!user) return
            await updateEngineerProfile(user._id, payload);
            toast.success("Profile updated");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-6 max-w-md">
            <h2 className="text-lg font-medium">Update Profile</h2>

            <div>
                <Label>Skills (comma separated)</Label>
                <Input {...register("skills")} />
            </div>

            <div>
                <Label>Seniority</Label>
                <select {...register("seniority")} className="w-full border rounded px-2 py-1">
                    <option value="">Select level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                </select>
            </div>

            <div>
                <Label>Department</Label>
                <select {...register("department")} className="w-full border rounded px-2 py-1">
                    <option value="">Select department</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="devOps">DevOps</option>
                    <option value="qa">QA</option>
                    <option value="ui/ux">UI/UX</option>
                    <option value="ml">ML</option>
                    <option value="data engineering">Data Engineering</option>
                </select>
            </div>

            <Button type="submit" className="w-full">
                Save Changes
            </Button>
        </form>
    );
};
