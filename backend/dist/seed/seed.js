"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../src/models/user.model"));
const project_model_1 = __importDefault(require("../src/models/project.model"));
const assignment_model_1 = __importDefault(require("../src/models/assignment.model"));
const message_model_1 = __importDefault(require("../src/models/message.model"));
const connectDB_1 = __importDefault(require("../src/connectDB"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// To run this file: npx ts-node seed.ts
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.default)();
        // You can comment out if you need fresh data in database every single time you run this seed.js
        yield user_model_1.default.deleteMany({});
        yield project_model_1.default.deleteMany({});
        yield assignment_model_1.default.deleteMany({});
        yield message_model_1.default.deleteMany({});
        //  Engineers
        const engineers = yield user_model_1.default.insertMany([
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
                password: yield bcryptjs_1.default.hash("Engineer@1", 10),
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
                password: yield bcryptjs_1.default.hash("Engineer@2", 10),
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
                password: yield bcryptjs_1.default.hash("Engineer@3", 10),
            },
        ]);
        //  Manager
        const manager = yield user_model_1.default.create({
            name: "Manager Mike",
            email: "manager@example.com",
            role: "manager",
            password: yield bcryptjs_1.default.hash("Manager@1", 10),
        });
        //  Projects
        const projects = yield project_model_1.default.insertMany([
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
        yield assignment_model_1.default.insertMany([
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
    }
    catch (error) {
        console.error(" Error seeding data:", error);
    }
    finally {
        yield mongoose_1.default.disconnect();
        console.log(" Disconnected from database.");
    }
}))();
