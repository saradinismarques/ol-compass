require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Schema
const caseStudySchema = new mongoose.Schema({
  title: String,
  collection: String,
  mainTarget: String,
  age: String,
  time: String,
  type: String,
  languages: String,
  year: String,
  description: String,
  credits: String,
  components: [String],  // Store components like Principles, Perspectives, Dimensions
  language: String
});

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);

// OpenAI API Setup
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This reads your API key from the .env file
});

// Route to get AI-generated responses
app.post("/generate-ai-response", async (req, res) => {
  const {prompt} = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Component and body of water are required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    console.log("Full OpenAI Response:", response); // Log full response

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error("Invalid response from OpenAI API");
    }

    res.json({ result: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ error: "Failed to generate response", details: error.message });
  }
});

// Case Studies Routes
app.get("/case-studies", async (req, res) => {
  const caseStudies = await CaseStudy.find();
  res.json(caseStudies);
});

app.post("/case-studies", async (req, res) => {
  console.log(req.body);
  const newCaseStudy = new CaseStudy(req.body);
  console.log(newCaseStudy);
  await newCaseStudy.save();
  res.json({ message: "Case Study added!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
