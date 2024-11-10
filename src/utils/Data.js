import learnData from '../data/learn-data.json';
import conceptsData from '../data/concepts-data.json';
import getInspiredData from '../data/get-inspired-data.json';

export function getComponentsData() {
    try {
        // Process the JSON data
        const result = learnData.map(item => ({
            Code: item["#code"],
            Label: item["#label"],
            Headline: item["#headline"],
            Paragraph: item["#paragraph"],
            Tooltip: item["#headline"],
            Type: getType(item['#code'])
        }));

        // Organize into three parts by Type
        const organizeComponents = result.reduce((acc, item) => {
            const type = item.Type;
            if (!acc[type]) {
                acc[type] = []; // Initialize the array for each type if it doesn't exist
            }
            acc[type].push(item);
            return acc;
        }, {});

        return organizeComponents;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

function getType(code) {
    // Define a mapping of prefixes to their corresponding full names
    const prefixMap = {
        "D": "Dimension",
        "Pe": "Perspective",
        "P": "Principle"
    };  
  
    // Use a regular expression to capture the prefix and the number
    const regex = /^([A-Za-z]+)(\d+)$/;
    const match = code.match(regex);
  
    if (match) {
        const prefix = match[1];
  
        // Find the corresponding full name for the prefix
        const type = prefixMap[prefix];
  
        if (type) {
            return type;
        }
    }
  // If the label doesn't match the expected pattern, return it unchanged
  return code;
}

export function getConceptsData() {
    try {
        // Process the JSON data
        const result = conceptsData.map(item => ({
            Code: item["#code"],
            Label: item["#label"],
            Paragraph: item["#paragraph"],
            LinkedTo: item["#linked-to"],
            Type: "Concept"
        }));

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getCaseStudies() {
    try {
        // Function to extract components and return the case study object
        const result = getInspiredData.map(item => ({
            Title: item["Title"],
            Collection: item["Collection"],
            MainTarget: item["Main Target"],
            Age: item["Age"],
            Time: item["Time"],
            Type: item["Type"],
            Languages: item["Laguage(s)"],
            Year: item["Year"],
            Description: item["Description"],
            Credits: item["Author, Country"],
            Components: Object.keys(item).filter(key => item[key] === 'Y')
        }));
        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}
