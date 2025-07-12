import mongoose from "mongoose";
import User from "../src/models/user.model";
import Project from "../src/models/project.model";
import Assignment from "../src/models/assignment.model";
import connectDB from "../src/connectDB";
import bcrypt from "bcryptjs"

// To run this file: npx ts-node seed.ts

(async () => {
    try {
        await connectDB();

        // You can comment out if you need fresh data in database every single time you run this seed.js
        
        await User.deleteMany({});
        await Project.deleteMany({});
        await Assignment.deleteMany({});

        //  Engineers
        const engineers = await User.insertMany([
            {
                name: "Alice Dev",
                email: "alice@example.com",
                role: "engineer",
                department: "frontend",
                skills: ["React", "TailwindCSS"],
                seniority: "mid",
                employmentType: "full-time",
                maxCapacity: 100,
                availableCapacity: 40,
                password: await bcrypt.hash("Engineer@1", 10),
            },
            {
                name: "Bob Ops",
                email: "bob@example.com",
                role: "engineer",
                department: "devOps",
                skills: ["Docker", "Node.js"],
                seniority: "senior",
                employmentType: "part-time",
                maxCapacity: 50,
                availableCapacity: 60,
                password: await bcrypt.hash("Engineer@2", 10),
            },
            {
                name: "Charlie Analyst",
                email: "charlie@example.com",
                role: "engineer",
                department: "ml",
                skills: ["Python", "MongoDB"],
                seniority: "junior",
                employmentType: "full-time",
                maxCapacity: 100,
                availableCapacity: 50,
                password: await bcrypt.hash("Engineer@3", 10),
            },
        ]);

        //  Manager
        const manager = await User.create({
            name: "Manager Mike",
            email: "manager@example.com",
            role: "manager",
            password: await bcrypt.hash("Manager@1", 10),
        });

        //  Projects
        const projects = await Project.insertMany([
            {
                name: "Frontend Revamp",
                description: "Modernize the UI with React and Tailwind",
                startDate: new Date("2024-07-01"),
                endDate: new Date("2024-09-30"),
                requiredSkills: ["React", "TailwindCSS"],
                teamSize: 2,
                status: "active",
                managerId: manager._id,
            },
            {
                name: "ML Insight Tool",
                description: "Develop a prediction engine with Python",
                startDate: new Date("2024-08-15"),
                endDate: new Date("2024-12-15"),
                requiredSkills: ["Python", "MongoDB"],
                teamSize: 2,
                status: "planning",
                managerId: manager._id,
            },
            {
                name: "Infra Migration",
                description: "Move systems to Docker-based deployment",
                startDate: new Date("2024-07-10"),
                endDate: new Date("2024-10-10"),
                requiredSkills: ["Docker", "Node.js"],
                teamSize: 1,
                status: "active",
                managerId: manager._id,
            },
        ]);

        //  Assignments
        await Assignment.insertMany([
            {
                engineerId: engineers[0]._id,
                projectId: projects[0]._id,
                allocationPercentage: 60,
                startDate: new Date("2024-07-01"),
                endDate: new Date("2024-09-30"),
                role: "Frontend Developer",
            },
            {
                engineerId: engineers[1]._id,
                projectId: projects[1]._id,
                allocationPercentage: 40,
                startDate: new Date("2024-07-15"),
                endDate: new Date("2024-10-10"),
                role: "DevOps Lead",
            },
            {
                engineerId: engineers[2]._id,
                projectId: projects[2]._id,
                allocationPercentage: 50,
                startDate: new Date("2024-08-15"),
                endDate: new Date("2024-12-15"),
                role: "ML Engineer",
            },
        ]);

        console.log(" Seed data inserted successfully.");
    } catch (error) {
        console.error(" Error seeding data:", error);
    } finally {
        await mongoose.disconnect();
        console.log(" Disconnected from database.");
    }
})();
