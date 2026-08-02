import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=>{
    res.send("TaskFlow Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

