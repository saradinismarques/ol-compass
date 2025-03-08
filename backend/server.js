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
  components: [String]  // <-- Add this line to store the components
});

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);

// Routes
app.get("/case-studies", async (req, res) => {
  const caseStudies = await CaseStudy.find();
  res.json(caseStudies);
});

app.post("/case-studies", async (req, res) => {
  const newCaseStudy = new CaseStudy(req.body);
  await newCaseStudy.save();
  res.json({ message: "Case Study added!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
