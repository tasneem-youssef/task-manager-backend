import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import cors from "cors";

const app = express();
//middelware
app.use(express.json());
const allowedOrigins = process.env.allowedconnection
  ? process.env.allowedconnection.split(',').map(o => o.trim())
  : [];

app.use(
  cors({
     origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
)

//connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("mongoDB connection error", error);
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
