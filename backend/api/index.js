const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Schema
const ansSchema = new mongoose.Schema({
    first: String,
    second: String,
}, {
    timestamps: true
});

const Ans = mongoose.model("Ans", ansSchema);

app.get("/" , (req,res)=>{
    res.json({
        status:true,
        api:"rinnning"
    })
})

// CREATE API
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

// IMPORTANT: DO NOT use app.listen() on Vercel
module.exports = app;