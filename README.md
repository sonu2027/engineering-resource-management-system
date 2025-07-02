# Engineering Resource Management System

- Track engineers, projects, assignments, and available capacity in one streamlined full-stack app.

# Tech Stack

- Frontend:
  React + TypeScript
  ShadCN UI + TailwindCSS
  React Hook Form, contextAPI

- Backend:
  Node.js + Express
  MongoDB + Mongoose
  JWT Auth, REST APIs

# Core Features

- Auth with JWT + role-based access
- Engineer dashboard: profile + assignments
- Manager dashboard: team overview + project assign

# Setup Instructions

- git clone https://github.com/sonu2027/engineering-resource-management-system.git

- Backend
  cd backend
  npm install
  npm run dev

- Frontend
  cd frontend
  npm install
  npm run dev
  Make sure frontend is running at http://localhost:5173

# .env

You don't need to create .env beacuse I haven't keep it on .gitignore

# AI Usage

# Which AI tools you used and how

- I used GitHub Copilot and ChatGPT as AI tools during the development of this project.

- I primarily used Copilot for tasks like API creation, schema design, and boilerplate generation.

- For debugging, understanding errors, and getting quick solutions, I took help from both ChatGPT and Copilot.

- Both tools were extremely helpful in accelerating development and resolving issues efficiently.

- I used ChatGPT to validate my logic, clarify doubts about implementation, and understand specific concepts when I needed deeper clarity.

# Specific examples of how AI accelerated your development

AI tools like GitHub Copilot and ChatGPT significantly accelerated my development process in several ways:

- I was able to quickly set up routes and build APIs with the help of AI, which saved a lot of time.

- Whenever I faced confusion or didn’t fully understand a concept, I used AI to gain clarity and validate my logic.

- I used AI assistance to rapidly set up ShadCN UI, which made creating reusable and styled components much faster.

- I built multiple UI components efficiently using Copilot suggestions, reducing manual effort.

- AI helped me integrate and configure React Hook Form quickly for form handling and validation.

- Overall, AI helped me move faster, solve problems in real-time, and stay focused on the core logic instead of getting stuck on repetitive or confusing tasks.

# Any challenges you faced with AI-generated code and how you resolved them

- At times, relying heavily on AI-generated code led to unexpected bugs that took time to debug and fix.

- One issue I faced was while making API calls — I forgot to include http://localhost:8000 in the URL, and the AI wasn't able to clearly identify or point out this small but critical mistake. Eventually, I manually noticed the problem and fixed it myself.

- I also found it challenging to fully understand some of the AI-generated code during code reviews, especially when trying to figure out how certain logic worked internally.

- Additionally, I encountered a number of errors during development. While some were difficult to trace, I was able to resolve most of them with the help of ChatGPT and Copilot after experimenting and digging deeper.

- These challenges taught me that while AI is incredibly helpful, it's important to manually validate and understand the code, especially in critical areas.

# Your approach to validating and understanding AI suggestions

To validate and understand AI-generated code suggestions, I followed a hands-on approach:

- I started by using console.log() statements to check the actual output and behavior of the code.

- I traced how the data was changing throughout different parts of the codebase.

- By observing what each line was doing to the data, I was able to break down and understand even complex code that the AI suggested.

- This step-by-step debugging approach helped me gain clarity and ensured that I wasn’t blindly copying code but actually understanding and verifying its logic.

# Demo

- Frontend: https://engineering-resource-management-system-frontend.vercel.app/
- Backend API: https://engineering-resource-management-system-backend.vercel.app/

# seed file structure

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
                password: await bcrypt.hash("engineer1", 10),
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
                password: await bcrypt.hash("engineer2", 10),
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
                password: await bcrypt.hash("engineer3", 10),
            },
        ]);

        //  Manager
        const manager = await User.create({
            name: "Manager Mike",
            email: "manager@example.com",
            role: "manager",
            password: await bcrypt.hash("manager1", 10),
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

# Run seed

- npx ts-node seed.ts
