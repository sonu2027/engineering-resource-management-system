import { useForm } from "react-hook-form";
import { createAssignment } from "../apiCall/createAssignment";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import toast from "react-hot-toast";
import checkSpacesForProject from "../apiCall/checkSpacesForProject";
import { SelectItem, SelectValue, SelectContent, SelectTrigger, Select } from "./ui/select";
import { Controller } from "react-hook-form";

type FormProps = {
    engineerId: string;
    projects: { _id: string; name: string }[];
    onAssigned: () => void;
};

export const AssignmentForm = ({ engineerId, projects, onAssigned }: FormProps) => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {

        if (data.allocationPercentage < 5) {
            toast.error("Allocation Percentage should be greater or equal to 5")
            return
        }
        else if (data.allocationPercentage > 100) {
            toast.error("Allocation Percentage should be less than or equal to 100")
            return
        }

        checkSpacesForProject(data.projectId)
            .then((response) => {
                if (!response.spaceAvailable) {
                    toast.error(response.message)
                    throw new Error("No space available");
                }
                return createAssignment({ ...data, engineerId })
            })
            .then(() => {
                toast.success("Engineer assigned!");
                reset();
                onAssigned();
            })
            .catch((error) => {
                toast.error(error.message)
                if (error.message !== "No space available") {
                    toast.error("Assignment failed");
                }
            })
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">

            <div className="space-y-1">
                <Label>Project</Label>
                <Controller
                    control={control}
                    name="projectId"
                    rules={{ required: "Project selection is required" }}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((p) => (
                                    <SelectItem key={p._id} value={p._id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.projectId?.message && (
                    <p className="text-sm text-red-500">{String(errors.projectId.message)}</p>
                )}
            </div>

            <div>
                <Label>Role</Label>
                <Input {...register("role", { required: "Role is required" })} />
                {errors.role && <p className="text-sm text-red-500">{String(errors.role.message)}</p>}
            </div>


            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label>Allocation (%)</Label>
                    <Input type="number" {...register("allocationPercentage", {
                        required: "Allocation is required",
                    })} />
                    {errors.allocationPercentage && (
                        <p className="text-sm text-red-500">{String(errors.allocationPercentage.message)}</p>
                    )}
                </div>

                <div>
                    <Label>Start Date</Label>
                    <Input type="date" {...register("startDate", { required: "Start date is required" })} />
                    {errors.startDate && <p className="text-sm text-red-500">{String(errors.startDate.message)}</p>}
                </div>

                <div>
                    <Label>End Date</Label>
                    <Input type="date" {...register("endDate", { required: "End date is required" })} />
                    {errors.endDate && <p className="text-sm text-red-500">{String(errors.endDate.message)}</p>}
                </div>
            </div>

            <Button type="submit" className="w-full">
                Assign Engineer
            </Button>
        </form>
    );
};
