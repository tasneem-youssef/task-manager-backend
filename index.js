import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import cors from "cors";

const app = express();
//middelware
app.use(express.json());
app.use(
  cors({ origin: "https://tasneem-youssef.github.io/task-manger-frontend", credentials: true }),
);

console.log(process.env.MONGO_URI);
//connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("mongoDB connection error", error);
  });

let isConnected = false;
const connecttoDatabase = async () => {
  if (isConnected) return;

  if (!hardcodedUri) {
    console.log("CRITICAL ERROR: MONGO_URI is not defined or not loaded!");
    throw new Error("MONGO_URI is missing");
  }

try {
  const db = await mongoose.connect(process.env.MONGO_URI);
  isConnected = db.connections[0].readyState;
  console.log("connected to Atlas");
} catch (error) {
  console.log("Error while connecting to Atlas", error);
  throw error;
}}

app.use(async (req, res, next) => {
  try {
    await connecttoDatabase();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database connection failed", details: error.message });
  }
});

//Routes
app.use("/auth", authRoutes); //auth routes
app.use("/api/tasks", taskRoutes); //task routes
//root route for testing
app.get("/", (req, res) => {
  res.send("task manager API is runnging");
});

//start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
