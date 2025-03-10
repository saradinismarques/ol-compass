const mongoose = require("mongoose");

// Define the schema for a case study
const caseStudySchema = new mongoose.Schema({
    title: { type: String, required: true },
    collection: { type: String, required: true },
    mainTarget: { type: String, required: true },
    age: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    languages: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
    credits: { type: String, required: true },
    components: {type: [String],  required: true },
    language: { type: String, required: true },
});

// Create the model from the schema
const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);

module.exports = CaseStudy;
