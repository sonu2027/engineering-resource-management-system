import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
    _id:string,
    email: string;
    name: string;
    role: string;
    employmentType?: "full-time" | "part-time";
    skills?: string[];
    seniority?: string;
    maxCapacity?: number;
    department?: string;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUserState(JSON.parse(stored));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};
