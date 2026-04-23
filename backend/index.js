const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS Configuration
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Database Connection Logic for Serverless
// This prevents multiple connections during Vercel "cold starts"
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
    }
};

// Middleware to ensure DB is connected before handling any request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// ===== SCHEMAS =====
const quizSchema = new mongoose.Schema({
    foodAnswer: { type: String, required: true },
    replyAnswer: { type: String, required: true },
}, { timestamps: true });
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema, "quizzes");

const noteSchema = new mongoose.Schema({
    from: String,
    title: String,
    message: { type: String, required: true },
}, { timestamps: true });
const Note = mongoose.models.Note || mongoose.model("Note", noteSchema, "notes");

// ===== ROUTES =====
app.get("/", (req, res) => {
    res.json({ status: true, api: "running" });
});

app.post("/create", async (req, res) => {
    try {
        const { foodAnswer, replyAnswer } = req.body;
        if (!foodAnswer || !replyAnswer) return res.status(400).json({ error: "Both answers are required!" });

        const saved = await Quiz.create({ foodAnswer, replyAnswer });
        res.status(201).json({ message: "Quiz saved!", data: saved });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/note", async (req, res) => {
    try {
        const { from, title, message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required!" });

        const saved = await Note.create({ from, title, message });
        res.status(201).json({ message: "Note saved!", data: saved });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/quizzes", async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Export for Vercel
module.exports = app;