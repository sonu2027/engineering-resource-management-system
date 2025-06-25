import { useForm } from "react-hook-form";
import { createAssignment } from "../apiCall/createAssignment";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";

type FormProps = {
    engineerId: string;
    projects: { _id: string; name: string }[];
    onAssigned: () => void;
};

export const AssignmentForm = ({ engineerId, projects, onAssigned }: FormProps) => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        try {
            await createAssignment({ ...data, engineerId });
            toast.success("Engineer assigned!");
            reset();
            onAssigned();
        } catch (err) {
            toast.error("Assignment failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
            <div>
                <Label>Project</Label>
                <select {...register("projectId")} className="w-full border rounded px-2 py-1">
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                        <option key={p._id} value={p._id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <Label>Role</Label>
                <Input {...register("role")} />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label>Allocation (%)</Label>
                    <Input type="number" {...register("allocationPercentage")} />
                </div>
                <div>
                    <Label>Start Date</Label>
                    <Input type="date" {...register("startDate")} />
                </div>
                <div>
                    <Label>End Date</Label>
                    <Input type="date" {...register("endDate")} />
                </div>
            </div>

            <Button type="submit" className="w-full">
                Assign Engineer
            </Button>
        </form>
    );
};
