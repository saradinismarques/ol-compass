require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const CaseStudy = require('./models/CaseStudy'); // Correct path to the model

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/content/en/get-inspired-data.json'), 'utf-8')); 

// Insert data into MongoDB
const insertData = async () => {
    try {
      // Clear the existing documents in the collection
      await CaseStudy.deleteMany({}); // This deletes all documents in the CaseStudy collection
      console.log("Existing data deleted");
  
      // Modify jsonData to include the components field and match field names
      const modifiedData = jsonData.map(item => {
        
        // Map the keys to match the Mongoose schema field names
        const mappedItem = {
            title: item["Title"],
            collection: item["Collection"],
            mainTarget: item["Main Target"],
            age: item["Age"],
            time: item["Time"],
            type: item["Type"],
            languages: item["Laguage(s)"],
            year: item["Year"],
            description: item["Description"],
            credits: item["Author, Country"],
            components: Object.keys(item).filter(key => item[key] === 'Y')
        };
  
        return mappedItem;
      });
  
      // Insert the modified data into MongoDB
      await CaseStudy.insertMany(modifiedData);
      console.log("Data successfully inserted");
      mongoose.connection.close();
    } catch (error) {
      console.error("Error inserting data:", error);
      mongoose.connection.close();
    }
};
  
  
// Call insertData to load the data into MongoDB
insertData();
