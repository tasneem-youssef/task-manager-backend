const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")
const cors= require("cors");
require('dotenv').config();

const app = express();

//middelware
app.use(express.json());
app.use(cors({ origin: "https://task-manager-79.netlify.app", credentials: true}));
//connect DB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB connected');
}).catch((error) => {
    console.log("mongoDB connection error", error);
});


//Routes
app.use('/auth', authRoutes);//auth routes
app.use('/api/tasks', taskRoutes);//task routes
//root route for testing
app.get('/', (req, res) => {
    res.send("task manager API is runnging");
});

//start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
