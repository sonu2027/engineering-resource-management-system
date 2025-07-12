import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UseProvider";
import { EngineerNavbar } from "../components/EngineerNavbar";
import { useNavigate } from "react-router-dom";
import { checkCookies } from "../apiCall/checkCookies";

const DEPARTMENTS = [
    "frontend",
    "backend",
    "devOps",
    "qa",
    "ui/ux",
    "ml",
    "data engineering",
];

const SKILLS = [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "TypeScript",
    "TailwindCSS",
    "Docker",
    "Jest",
];


export const EngineerProfile = () => {
    const { user } = useUser();
    const [editable, setEditable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        skills: [] as string[],
        availableCapacity: "",
    });


    const fetchUser = async () => {
        try {
            if (!user?._id) return
            console.log(user?._id);
            const userId = user?._id

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/engineer/profile/${userId}`, {
                credentials: "include",
            });
            const data = await res.json();
            setFormData({
                name: data.name,
                email: data.email,
                department: data.department || "",
                availableCapacity: data.availableCapacity + "%",
                skills: data.skills || [],
            });

            // setUser?.(data); 
        } catch (err) {
            toast.error("Failed to load profile");
        }
    }

    useEffect(() => {
        fetchUser()
    }, [user?._id]);


    const handleUpdate = async () => {
        setIsSaving(true);

        const trimmedName = formData.name.trim();

        if (trimmedName.length < 6 || trimmedName.length > 50) {
            toast.error("Name must be between 7 and 50 characters");
            setIsSaving(false);
            return;
        }

        if (/^\s|\s$/.test(formData.name) || /\s{2,}/.test(formData.name)) {
            toast.error("No leading/trailing or multiple consecutive spaces allowed");
            setIsSaving(false);
            return;
        }

        const words = trimmedName.split(" ");
        if (words.some((word) => word.length < 3)) {
            toast.error("Each word must be at least 3 characters long");
            setIsSaving(false);
            return;
        }

        try {
            const userId = user?._id
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/engineer/updateprofile/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: formData.name,
                    department: formData.department,
                    skills: formData.skills,
                }),
            });

            if (!res.ok) throw new Error();
            toast.success("Profile updated successfully");
            setEditable(false);
        } catch {
            toast.error("Update failed");
        } finally {
            setIsSaving(false);
        }
    };

    const navigate = useNavigate()

    useEffect(() => {
        checkCookies()
            .then((res) => {
                if (!res.success) {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.log("error in home: ", error);
                navigate("/login")
            })
    }, [])


    return (
        <>
            <EngineerNavbar />
            <div className="w-full max-w-xl px-4 py-6 mx-auto">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 text-center">
                            Engineer Profile
                        </h2>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                maxLength={50}
                                disabled={!editable}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input disabled value={formData.email} />
                        </div>
                        <div className="grid gap-2">
                            <div className="grid gap-2">
                                <div className="grid gap-2">
                                    <Label>Department</Label>
                                    <div className="flex flex-wrap gap-3">
                                        {DEPARTMENTS.map((dep) => (
                                            <label key={dep} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="department"
                                                    disabled={!editable}
                                                    checked={formData.department === dep}
                                                    onChange={() => setFormData({ ...formData, department: dep })}
                                                />
                                                <span className="capitalize text-sm">{dep}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            <div className="grid gap-2">
                                <Label>Skills</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {SKILLS.map((skill) => (
                                        <label key={skill} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                disabled={!editable}
                                                checked={formData.skills.includes(skill)}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    const updatedSkills = isChecked
                                                        ? [...formData.skills, skill]
                                                        : formData.skills.filter((s) => s !== skill);

                                                    setFormData({ ...formData, skills: updatedSkills });
                                                }}
                                            />
                                            <span className="text-sm">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>


                        </div>
                        <div className="grid gap-2">
                            <Label>Available Capacity</Label>
                            <Input disabled value={formData.availableCapacity} />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            {!editable ? (
                                <Button variant="outline" onClick={() => setEditable(true)}>
                                    Edit
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => setEditable(false)}>Cancel</Button>
                                    <Button onClick={handleUpdate} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save"}
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="pt-4 text-center sm:text-right">
                            <Button variant="secondary" size="sm" asChild>
                                <a href="/reset-password">Change Password</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
