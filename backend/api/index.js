const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS fix - allow all origins
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("DB Error:", err));

// ===== SCHEMA 1: Quiz Answers =====
const quizSchema = new mongoose.Schema({
    foodAnswer: String,
    replyAnswer: String,
}, { timestamps: true });
const Quiz = mongoose.model("Quiz", quizSchema);

// ===== SCHEMA 2: Birthday Notes =====
const noteSchema = new mongoose.Schema({
    from: String,
    title: String,
    message: String,
}, { timestamps: true });
const Note = mongoose.model("Note", noteSchema);

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
    res.json({ status: true, api: "running" });
});

// ===== ENDPOINT 1: Save Quiz Answers =====
app.post("/create", async (req, res) => {
    try {
        console.log("Received quiz data:", req.body); // 👈 helps debug
        const { foodAnswer, replyAnswer } = req.body;

        if (!foodAnswer || !replyAnswer) {
            return res.status(400).json({ error: "Both answers required" });
        }

        const saved = await new Quiz({ foodAnswer, replyAnswer }).save();
        res.status(201).json({ message: "Quiz saved!", data: saved });
    } catch (error) {
        console.error("Create error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ===== ENDPOINT 2: Save Birthday Note =====
app.post("/note", async (req, res) => {
    try {
        console.log("Received note data:", req.body); // 👈 helps debug
        const { from, title, message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const saved = await new Note({ from, title, message }).save();
        res.status(201).json({ message: "Note saved!", data: saved });
    } catch (error) {
        console.error("Note error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ===== GET all notes =====
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== GET all quiz answers =====
app.get("/quizzes", async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;