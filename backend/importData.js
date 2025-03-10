require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const CaseStudy = require('./models/CaseStudy'); // Correct path to the model

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Read the English and Portuguese JSON files
const enData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/content/en/get-inspired-data.json'), 'utf-8'));
const ptData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/content/pt/get-inspired-data.json'), 'utf-8'));

// Function to insert data for a given language
const insertData = async (data, language) => {
    try {
      // Modify the data to include the language field
      const modifiedData = data.map(item => {
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
            components: Object.keys(item).filter(key => item[key] === 'Y'),
            language: language // Add the language field
        };
        return mappedItem;
      });

      // Insert the modified data into MongoDB
      await CaseStudy.insertMany(modifiedData);
      console.log(`${language} data successfully inserted`);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
};

const main = async () => {
  try {
    // Clear all existing documents from the collection (regardless of the language)
    await CaseStudy.deleteMany({});
    console.log("Existing data deleted");

    // Insert both English and Portuguese data in parallel
    await Promise.all([
      insertData(enData, 'en'),
      insertData(ptData, 'pt')
    ]);

    // Close the connection after both insertions are done
    mongoose.connection.close();
  } catch (error) {
    console.error("Error in main function:", error);
    mongoose.connection.close();
  }
};

// Run the main function to insert the data
main();
