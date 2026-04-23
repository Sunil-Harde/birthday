// server.js

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const ansSchema = new mongoose.Schema({
    first: String,
    second: String,
});

const Ans = mongoose.model("Ans", ansSchema);

app.post("/create", async (req, res) => {
    try {
        const { first, second } = req.body;

        const newData = new Ans({ first, second });
        const savedData = await newData.save();

        res.status(201).json({
            message: "Created successfully",
            data: savedData
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});