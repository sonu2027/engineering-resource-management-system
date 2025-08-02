"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env", });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
console.log("process.env.corsorigin: ", process.env.CORS_ORIGIN);
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    // methods: "GET,POST,PUT,DELETE",
    // allowedHeaders: "Content-Type,Authorization",
}));
app.use(express_1.default.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
app.use("/api/auth", auth_route_1.default);
const project_route_1 = __importDefault(require("./routes/project.route"));
app.use("/api", project_route_1.default);
const user_route_1 = __importDefault(require("./routes/user.route"));
app.use("/api", user_route_1.default);
const assignment_route_1 = __importDefault(require("./routes/assignment.route"));
app.use("/api", assignment_route_1.default);
const message_route_1 = __importDefault(require("./routes/message.route"));
app.use("/api", message_route_1.default);
exports.default = app;
